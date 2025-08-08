import { Response } from "express";
import { GoogleGenAI } from "@google/genai";
import { embedText } from "./embedUserMessage.js";
import { pineconeIndex } from "../config/PineconeClient.js";
import { InferenceClient } from "@huggingface/inference";
import { encode } from "gpt-tokenizer";
import Chat from "../models/Chat.js";

export async function modelDeepSeekV3(
  message: string,
  res: Response,
  project: any,
  user: any,
  projectId: string,
  userId
) {
  try {
    // 1️⃣ Vector search for RAG context
    const messageVector = await embedText(message);
    const namespace = project.namespace;

    const queryResult = await pineconeIndex.namespace(namespace).query({
      vector: messageVector as number[],
      topK: 5,
      includeMetadata: true,
    });

    const topChunks =
      queryResult.matches
        ?.map((match: any) => match.metadata?.content)
        .join("\n\n") || "";

    // 2️⃣ Streaming headers for SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Cache-Control");
    res.flushHeaders();

const systemPrompt = `
${project.AgentInstructions || "You are a friendly, helpful AI assistant."}
Always respond in a warm, engaging tone while still being accurate and clear.
Use the provided knowledge base context when it is relevant, but if the question 
is unrelated or no relevant context is found, still provide a thoughtful, 
helpful answer using your general knowledge.

## CRITICAL THINKING RULES
1. Always use the retrieved "Knowledge Base Context" first — only use general knowledge if context is missing or incomplete.
2. If context contradicts general knowledge, **prioritize context**.
3. Think step-by-step before writing the answer.
4. State any assumptions if you have to infer.
5. Avoid speculation; if unsure, say "I don't have enough information."

## RESPONSE STRUCTURE
- Start with a **brief, high-level overview**.
- Break the answer into **clear sections** with headings.
- Include **examples** where relevant.
- End with a **concise summary or recommended next steps**.

## MARKDOWN RULES (STRICT)
- # for main titles, ## for sections, ### for subsections
- Use **bold** for key terms and *italics* for emphasis
- Use - for unordered lists, 1. 2. 3. for ordered lists
- Add blank lines before/after lists
- Use proper Markdown tables with | separators and header rows
- Use [descriptive text](url) for links
- Use > blockquotes for key insights or citations
- Use --- for major section breaks

## TONE
- Professional but approachable
- Concise sentences; no fluff
- Always maintain logical flow

You must follow **both** the thinking rules and the formatting rules.

---
Knowledge Base Context:
${topChunks || "No relevant context found."}
`;


    const hfClient = new InferenceClient(process.env.HF_TOKEN);

    const messages = [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: message,
      },
    ];

    // 4️⃣ Start streaming from HuggingFace Fireworks AI
    const stream = hfClient.chatCompletionStream({
      provider: "fireworks-ai",
      model: "deepseek-ai/DeepSeek-V3",
      messages,
      temperature: 0.9,
      top_p: 1,
    });

    let fullResponse = "";
    let chunkCount = 0;

    // Confirm SSE connection
    res.write(
      `data: ${JSON.stringify({
        type: "connection",
        status: "connected",
        timestamp: Date.now(),
      })}\n\n`
    );

    // Stream chunks
    for await (const chunk of stream) {
      if (chunk.choices && chunk.choices.length > 0) {
        const chunkText = chunk.choices[0].delta?.content || "";
        if (chunkText) {
          fullResponse += chunkText;
          chunkCount++;

          res.write(
            `data: ${JSON.stringify({
              type: "chunk",
              content: chunkText,
              chunkIndex: chunkCount,
              timestamp: Date.now(),
            })}\n\n`
          );

          if (chunkCount % 3 === 0) {
            await new Promise((resolve) => setTimeout(resolve, 50));
          }
        }
      }
    }

    // Completion signal
    res.write(
      `data: ${JSON.stringify({
        type: "complete",
        fullContent: fullResponse,
        totalChunks: chunkCount,
        timestamp: Date.now(),
      })}\n\n`
    );

    // Token usage tracking
    const messageTokens = encode(message).length;
    const responseTokens = encode(fullResponse).length;
    const totalTokens = messageTokens + responseTokens;

    // Save to DB
    await Promise.all([
      Chat.create({
        userId,
        projectId,
        question: message,
        answer: fullResponse,
      }),
      user.updateOne({ $inc: { "usage.tokensUsed": totalTokens } }),
      project.updateOne({ $inc: { tokensUsed: totalTokens } }),
    ]);

    res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
    res.end();
  } catch (err) {
    console.error("DeepSeek-V3 streaming error:", err);
    res.write(
      `data: ${JSON.stringify({
        type: "error",
        message:
          "Sorry, I encountered an error while processing your request. Please try again.",
        timestamp: Date.now(),
      })}\n\n`
    );
    res.write(`data: [DONE]\n\n`);
    res.end();
  }
}

export async function modelGemini2_0flash(
  message: string,
  res: Response,
  project: any,
  user: any,
  projectId: string,
  userId: string
) {
  try {
    // Vector search for knowledge base
    const messageVector = await embedText(message);
    const namespace = project.namespace;

    const queryResult = await pineconeIndex.namespace(namespace).query({
      vector: messageVector as number[],
      topK: 5,
      includeMetadata: true,
    });

    const topChunks =
      queryResult.matches
        ?.map((match: any) => match.metadata?.content)
        .join("\n\n") || "";

    // Set up streaming headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Cache-Control");
    res.flushHeaders();

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });

    const systemPrompt = `You are to strictly follow the instructions below. DO NOT deviate from them.
    
${project.AgentInstructions || "You are a helpful assistant."}

CRITICAL MARKDOWN FORMATTING RULES - Follow these EXACTLY:

**Structure & Hierarchy:**
- Use # for main titles, ## for major sections, ### for subsections
- Use clear, descriptive headers that outline your response structure
-use both ordered and unordered list items

**Code Formatting:**
- ALWAYS specify the language for code blocks: \`\`\`javascript\n...\n\`\`\`
- Use \`inline code\` for variables, functions, and short technical terms
- For multi-line code, always use fenced code blocks with language specification
- Add descriptive comments in code when helpful

**Lists & Organization:**
- Use - for unordered lists (not * or +)
- Use 1. 2. 3. for ordered lists
- Add blank lines before and after list blocks
- Keep list items concise but complete

**Emphasis & Styling:**
- Use **bold** for important terms and key concepts
- Use *italics* for emphasis and definitions
- Use > for blockquotes when citing or highlighting important information
- Use --- for horizontal rules to separate major sections

**Tables & Data:**
- Use proper markdown tables with | separators
- Include header rows with alignment indicators
- Keep table content concise and well-aligned

**Links & References:**
- Use [descriptive text](url) format for links
- Make link text meaningful and descriptive

**Best Practices:**
- Start responses with a brief overview if the topic is complex
- Use clear paragraph breaks for readability
- End with a summary or next steps when appropriate
- Ensure logical flow from one section to the next`;

    const contents = [
      {
        role: "user",
        parts: [
          {
            text: `${systemPrompt}
  
Knowledge Base Context:
${topChunks || "No relevant context found."}
  
---
  
User Question: ${message}`,
          },
        ],
      },
    ];

    const config = {
      temperature: 0.7,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 8192,
    };

    const stream = await ai.models.generateContentStream({
      model: "gemini-2.0-flash",
      contents,
      config,
    });

    let fullResponse = "";
    let chunkCount = 0;

    // Send initial connection confirmation
    res.write(
      `data: ${JSON.stringify({
        type: "connection",
        status: "connected",
        timestamp: Date.now(),
      })}\n\n`
    );

    // Process stream chunks
    for await (const chunk of stream) {
      if (chunk.text) {
        const chunkText = chunk.text;
        fullResponse += chunkText;
        chunkCount++;

        // Send chunk to frontend
        const chunkData = {
          type: "chunk",
          content: chunkText,
          chunkIndex: chunkCount,
          timestamp: Date.now(),
        };

        res.write(`data: ${JSON.stringify(chunkData)}\n\n`);

        // Add small delay for smoother streaming effect
        if (chunkCount % 3 === 0) {
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
      }
    }

    // Send completion signal
    const completionData = {
      type: "complete",
      fullContent: fullResponse,
      totalChunks: chunkCount,
      timestamp: Date.now(),
    };

    res.write(`data: ${JSON.stringify(completionData)}\n\n`);

    // Calculate token usage
    const messageTokens = encode(message).length;
    const responseTokens = encode(fullResponse).length;
    const totalTokens = messageTokens + responseTokens;

    // Save to database
    await Promise.all([
      Chat.create({
        userId,
        projectId,
        question: message,
        answer: fullResponse,
      }),
      user.updateOne({ $inc: { "usage.tokensUsed": totalTokens } }),
      project.updateOne({ $inc: { tokensUsed: totalTokens } }),
    ]);

    // Send final done signal
    res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
    res.end();
  } catch (err) {
    console.error("Gemini streaming error:", err);

    const errorData = {
      type: "error",
      message:
        "Sorry, I encountered an error while processing your request. Please try again.",
      timestamp: Date.now(),
    };

    res.write(`data: ${JSON.stringify(errorData)}\n\n`);
    res.write(`data: [DONE]\n\n`);
    res.end();
  }
}

export async function modelKimiK2Instruct(
  message: string,
  res: Response,
  project: any,
  user: any,
  projectId: string,
  userId
) {
  try {
    const client = new InferenceClient(process.env.HF_TOKEN!);

    // Vector search for knowledge base
    const messageVector = await embedText(message);
    const namespace = project.namespace;

    const queryResult = await pineconeIndex.namespace(namespace).query({
      vector: messageVector as number[],
      topK: 5,
      includeMetadata: true,
    });

    const topChunks =
      queryResult.matches
        ?.map((match: any) => match.metadata?.content)
        .join("\n\n") || "";

    const agentInstructions =
      project.AgentInstructions || "You are a helpful assistant.";

    const messages = [
      {
        role: "user",
        content: `${agentInstructions}

${topChunks ? `Knowledge Base Context:\n${topChunks}\n---\n` : ""}User Question: ${message}`,
      },
    ];

    // Set headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Cache-Control");
    res.flushHeaders();

    res.write(
      `data: ${JSON.stringify({
        type: "connection",
        status: "connected",
        timestamp: Date.now(),
      })}\n\n`
    );

    const chatCompletion = await client.chatCompletion({
      provider: "featherless-ai",
      model: "moonshotai/Kimi-K2-Instruct",
      messages,
      max_tokens: 16000,
    });

    const content =
      chatCompletion.choices?.[0]?.message?.content || "No response.";
    const improvedMarkdown = postProcessMarkdown(content);

    res.write(
      `data: ${JSON.stringify({
        type: "complete",
        fullContent: improvedMarkdown,
        totalChunks: 1,
        timestamp: Date.now(),
      })}\n\n`
    );

    const messageTokens = encode(message).length;
    const responseTokens = encode(improvedMarkdown).length;
    const totalTokens = messageTokens + responseTokens;

    await Promise.all([
      Chat.create({
        userId,
        projectId,
        question: message,
        answer: improvedMarkdown,
      }),
      user.updateOne({ $inc: { "usage.tokensUsed": totalTokens } }),
      project.updateOne({ $inc: { tokensUsed: totalTokens } }),
    ]);

    res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
    res.end();
  } catch (err) {
    console.error("Kimi-K2 interaction error:", err);

    const errorData = {
      type: "error",
      message: "Sorry, I encountered an error while processing your request.",
      timestamp: Date.now(),
    };

    res.write(`data: ${JSON.stringify(errorData)}\n\n`);
    res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
    res.end();
  }
}

export async function modelDeepSeekR1(
  message: string,
  res: Response,
  project: any,
  user: any,
  projectId: string,
  userId
) {
  try {
    const client = new InferenceClient(process.env.HF_TOKEN!);

    // Vector search for knowledge base
    const messageVector = await embedText(message);
    const namespace = project.namespace;

    const queryResult = await pineconeIndex.namespace(namespace).query({
      vector: messageVector as number[],
      topK: 5,
      includeMetadata: true,
    });

    const topChunks =
      queryResult.matches
        ?.map((match: any) => match.metadata?.content)
        .join("\n\n") || "";

    const agentInstructions =
      project.AgentInstructions || "You are a helpful assistant.";

    const messages = [
      {
        role: "user",
        content: `${agentInstructions}\n\n${topChunks ? `Knowledge Base Context:\n${topChunks}\n---\n` : ""}User Question: ${message}`,
      },
    ];

    // Set up streaming headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Cache-Control");
    res.flushHeaders();

    res.write(
      `data: ${JSON.stringify({
        type: "connection",
        status: "connected",
        timestamp: Date.now(),
      })}\n\n`
    );

    const stream = await client.chatCompletionStream({
      provider: "novita",
      model: "deepseek-ai/DeepSeek-R1",
      messages,
      max_tokens: 16000,
    });

    let fullResponse = "";
    let chunkCount = 0;

    for await (const chunk of stream) {
      const newContent = chunk.choices?.[0]?.delta?.content || "";
      if (newContent) {
        fullResponse += newContent;
        chunkCount++;

        const chunkData = {
          type: "chunk",
          content: newContent,
          chunkIndex: chunkCount,
          timestamp: Date.now(),
        };

        res.write(`data: ${JSON.stringify(chunkData)}\n\n`);

        if (chunkCount % 3 === 0) {
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
      }
    }

    const improvedMarkdown = postProcessMarkdown(fullResponse);

    const completionData = {
      type: "complete",
      fullContent: improvedMarkdown,
      totalChunks: chunkCount,
      timestamp: Date.now(),
    };

    res.write(`data: ${JSON.stringify(completionData)}\n\n`);

    const messageTokens = encode(message).length;
    const responseTokens = encode(improvedMarkdown).length;
    const totalTokens = messageTokens + responseTokens;

    await Promise.all([
      Chat.create({
        userId,
        projectId,
        question: message,
        answer: improvedMarkdown,
      }),
      user.updateOne({ $inc: { "usage.tokensUsed": totalTokens } }),
      project.updateOne({ $inc: { tokensUsed: totalTokens } }),
    ]);

    res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
    res.end();
  } catch (err) {
    console.error("DeepSeek-R1 streaming error:", err);

    const errorData = {
      type: "error",
      message: "Sorry, I encountered an error while processing your request.",
      timestamp: Date.now(),
    };

    res.write(`data: ${JSON.stringify(errorData)}\n\n`);
    res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
    res.end();
  }
}

function postProcessMarkdown(markdown: string): string {
  let improved = markdown;

  // Enhanced markdown post-processing for better formatting
  improved = improved
    .replace(/^(#{1,6})\s*(.+)$/gm, (match, hashes, title) => {
      return `\n${hashes} ${title.trim()}\n`;
    })

    // Fix code block formatting
    .replace(/```(\w*)\n/g, "\n```$1\n")
    .replace(/\n```(\w*)\n/g, "\n\n```$1\n")
    .replace(/\n```\n/g, "\n```\n\n")

    // Improve list formatting with proper spacing
    .replace(/^(\s*[-*+])\s+(.+)$/gm, "$1 $2")
    .replace(/^(\s*\d+\.)\s+(.+)$/gm, "$1 $2")

    // Add spacing around list blocks
    .replace(/(\n\n)([-*+] .+(?:\n[-*+] .+)*)/g, "$1$2\n")
    .replace(/(\n\n)(\d+\. .+(?:\n\d+\. .+)*)/g, "$1$2\n")

    // Enhance blockquote formatting
    .replace(/^>\s*(.+)$/gm, "> $1")
    .replace(/(\n\n)(> .+(?:\n> .+)*)/g, "$1$2\n")

    // Improve table formatting
    .replace(/\|(.+?)\|/g, (match, content) => {
      const cells = content.split("|").map((cell) => cell.trim());
      return "| " + cells.join(" | ") + " |";
    })

    // Ensure proper spacing around horizontal rules
    .replace(/^(-{3,}|\*{3,}|_{3,})$/gm, "\n---\n")

    // Fix emphasis formatting
    .replace(/\*\*([^*]+)\*\*/g, "**$1**")
    .replace(/\*([^*]+)\*/g, "*$1*")

    // Improve paragraph spacing
    .replace(/\n{3,}/g, "\n\n")

    // Ensure proper spacing around code blocks
    .replace(/(\n```[\w]*\n)([\s\S]*?)(\n```\n)/g, "\n$1$2$3\n")

    // Clean up beginning and end
    .replace(/^\n+/, "")
    .replace(/\n+$/, "\n")

    // Ensure headers have proper spacing
    .replace(/(\n#{1,6} .+\n)([^\n])/g, "$1\n$2")
    .replace(/([^\n])(\n#{1,6} .+)/g, "$1\n$2")

    // Fix inline code spacing
    .replace(/`([^`]+)`/g, "`$1`")

    // Ensure blockquotes have proper spacing
    .replace(/([^\n])(\n> .+)/g, "$1\n$2")
    .replace(/(\n> .+(?:\n> .+)*)([^\n])/g, "$1\n$2");

  return improved;
}
