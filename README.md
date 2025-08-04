# 🤖 Ragna - Build intelligent AI agents powered by your own data

<div align="center">





[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](CONTRIBUTING.md)


</div>

## 🌟 Overview

Ragna is an open-source platform that enables developers to create intelligent AI agents powered by their own knowledge bases. Upload documents, train custom AI models, and deploy conversational agents that understand your specific domain knowledge—all without the risk of hallucinations.

### ✨ Key Features

- 📚 **Smart Knowledge Base Management** - Upload PDF, DOCX, CSV, and TXT files with automatic vectorization
- 🤖 **Multiple AI Models** - Support for GPT-4, Claude 3, Gemini Pro, and custom models
- 💬 **Real-time Chat Interface** - Built-in chat UI for interacting with your agents

- 🎨 **Embeddable Widgets** - Add AI chatbots to any website with a single React component
- 🛡️ **Zero Hallucinations** - Responses grounded in your uploaded documents only
- 🏗️ **Project Isolation** - Separate knowledge bases for each project
- ⚡ **Lightning Fast** - Sub-second response times with optimized vector search
- 🔒 **Secure & Private** - Your data stays isolated and secure

## 🏗️ Architecture




### Tech Stack

**Frontend:**
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- React Hook Form
- Zustand (State Management)
- TanStack Query (Data Fetching)

**Backend:**
- Node.js with Express
- TypeScript
- MongoDB
- Pinecone
- ZOD (Schema Validation)
- bcrypt (Password Hashing)
- jsonwebtoken (JWT Authentication)
- express-rate-limit (Rate Limiting)
- mongoose (MongoDB ODM)
- multer (File Upload)
- cloudinary (Image Storage)

**AI & ML:**
- Google Gemini Pro
- LangChain
- Pinecone Vector Database
- Sentence Transformers
- manual text chunking




## 📖 Usage

### Creating Your First Project

1. **Sign up** and create an account
2. **Create a new project** with a descriptive name
3. **Choose an AI model** (GPT-4, Claude 3, etc.)
4. **Write agent instructions** to define behavior
5. **Upload documents** to build your knowledge base
6. **Test your agent** in the chat interface

### Integration Examples

#### NPM Package Integration

```bash
npm install ragna-integration
```

```typescript
import { RagnaClient, useRagnaChat } from 'ragna-integration';

function ChatComponent() {
  const client = new RagnaClient('your-project-id', 'your-api-key');
  const { messages, sendMessage, isLoading } = useRagnaChat(client);

  const handleSend = async (message: string) => {
    await sendMessage(message);
  };

  return (
    <div>
      {messages.map((msg, idx) => (
        <div key={idx}>{msg.content}</div>
      ))}
      <input onSubmit={handleSend} />
    </div>
  );
}
```

#### Embeddable Chat Widget

```typescript
import { RagnaClient, RagnaChatEmbed } from 'ragna-integration';

function App() {
  const client = new RagnaClient('your-project-id', 'your-api-key');

  return (
    <div>
      {/* Your existing content */}
      <h1>Welcome to my website</h1>
      
      {/* AI Chatbot Widget */}
      <RagnaChatEmbed
        client={client}
        logoUrl="/logo.svg"
        name="AI Assistant"
        size={62}
      />
    </div>
  );
}


   ```

## 🤝 Contributing

I welcome contributions from the community! Here's how you can help:

### Ways to Contribute

- 🐛 **Report bugs** - Found a bug? [Open an issue](https://github.com/yourusername/ragna/issues)
- 💡 **Suggest features** - Have an idea? [Start a discussion](https://github.com/yourusername/ragna/discussions)
- 📝 **Improve documentation** - Help make our docs better
- 🔧 **Submit code** - Fix bugs or add new features
- 🎨 **Design improvements** - Help improve the UI/UX
- 🌍 **Translations** - Help translate Ragna to other languages








### Supported File Formats

- **PDF** - Portable Document Format
- **DOCX** - Microsoft Word documents
- **TXT** - Plain text files
- **CSV** - Comma-separated values



## 📊 Roadmap

### Current Version (v1.0)
- ✅ Basic knowledge base management
- ✅ Single AI model support
- ✅ Real-time chat interface
- ✅ NPM package integration
- ✅ Embeddable widgets

### Upcoming Features (v1.1)
- 🔄 Advanced analytics dashboard
- 🔄 Webhook support
- 🔄 Custom model fine-tuning
- 🔄 Multi-language support
- 🔄 Advanced permission system






---

<div align="center">

**Made with ❤️ by Dipan Chakraborty**

<!-- [Website](https://ragna.ai) • [Twitter](https://twitter.com/ragna_ai) • [LinkedIn](https://linkedin.com/company/ragna) -->

</div>


