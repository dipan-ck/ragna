

import Image from "next/image"

export default function ChatInterface() {
  return (
    <section className="py-32 px-6 border-t border-gray-800 relative overflow-hidden">

            <div className="w-180 h-100 absolute right-[60%] top-[30%]  bg-[radial-gradient(at_top_left,#ff4500,#ff0000,#ff00ff,#800080,#0000ff,#000033)] rounded-lg blur-3xl transform group-hover:scale-110 transition-transform duration-200"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="relative">
              {/* Floating Message Bubbles */}
              <div className="absolute -top-22 -left-8 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 backdrop-blur max-w-xs">
                <p className="text-sm text-blue-200">What's our refund policy for enterprise customers?</p>
                <div className="text-xs text-gray-400 mt-2">Just now</div>
              </div>

              <div className="absolute -top-22 z-20 -right-12 bg-green-500/10 border border-green-500/20 rounded-2xl p-4 backdrop-blur max-w-xs">
                <p className="text-sm text-green-200">Based on your policy document, enterprise customers have...</p>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-400">0.8s response</span>
                </div>
              </div>

              {/* Main Image Container */}
              <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur border border-gray-700/50 rounded-3xl p-2 shadow-2xl">
                <div className="relative overflow-hidden rounded-2xl">
                  <Image
                    src="/screenshot/chat.png"
                    alt="AI Chat Interface"
                    width={800}
                    height={500}
                    className="w-full h-auto"
                  />

                  {/* Overlay Elements */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>

                {/* Live Activity Indicator */}
                <div className="absolute top-6 right-6">
                  <div className="bg-black/80 backdrop-blur border border-gray-700 rounded-xl px-4 py-2 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-400">Live</span>
                  </div>
                </div>

                {/* Context Sources */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-black/80 backdrop-blur border border-gray-700 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-white ">Context Sources</span>
                      <span className="text-xs text-white">3 documents referenced</span>
                    </div>
                    <div className="flex space-x-2">
                      <div className="flex-1 bg-blue-500/20 border border-blue-500/30 rounded-lg p-2">
                        <div className="text-xs text-blue-300">policy.pdf</div>
                        <div className="text-xs text-white">92% relevance</div>
                      </div>
                      <div className="flex-1 bg-green-500/20 border border-green-500/30 rounded-lg p-2">
                        <div className="text-xs text-green-300">faq.docx</div>
                        <div className="text-xs text-white">87% relevance</div>
                      </div>
                      <div className="flex-1 bg-purple-500/20 border border-purple-500/30 rounded-lg p-2">
                        <div className="text-xs text-purple-300">terms.txt</div>
                        <div className="text-xs text-[#ffffff]">74% relevance</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Stats */}
              <div className="absolute -bottom-12 -left-8 bg-black/80 backdrop-blur border border-gray-700 rounded-2xl p-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-400">&lt;1s</div>
                    <div className="text-xs text-[#ffffff]">Avg Response</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-400">98%</div>
                    <div className="text-xs text-[#ffffff]">Accuracy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="inline-flex items-center px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full mb-8">
              <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 animate-pulse"></div>
              <span className="text-sm text-[#9f9f9f]">AI Chat</span>
            </div>

            <h2 className="text-4xl  mb-6 text-white font-medium tracking-tighter">
              Conversations that
              <br />
                understand context

            </h2>

            <p className="text-base text-[#9f9f9f]  mb-12">
              Your AI agents don't just chat—they understand. Every response is grounded in your specific knowledge
              base, ensuring accurate, contextual, and relevant conversations.
            </p>

            {/* Key Benefits */}
            <div className="space-y-8 mb-12">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className=" text-white mb-2">Zero Hallucinations</h4>
                  <p className="text-[#9f9f9f] text-sm leading-relaxed">
                    Responses are always grounded in your uploaded documents. No made-up facts, no false
                    information—just accurate answers from your knowledge base.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white mb-2">Lightning Fast</h4>
                  <p className="text-[#9f9f9f] text-sm leading-relaxed">
                    Sub-second response times with intelligent caching and optimized vector search. Your users get
                    instant answers without the wait.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white mb-2">Smart Context</h4>
                  <p className="text-[#9f9f9f] text-sm leading-relaxed">
                    Advanced semantic search finds the most relevant information across your entire knowledge base,
                    providing rich context for every response.
                  </p>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-4">
                <div className="text-2xl font-bold text-white mb-1">0.8s</div>
                <div className="text-xs text-gray-400">Avg Response Time</div>
              </div>
              <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-4">
                <div className="text-2xl font-bold text-white mb-1">98%</div>
                <div className="text-xs text-gray-400">Context Accuracy</div>
              </div>
              <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-4">
                <div className="text-2xl font-bold text-white mb-1">24/7</div>
                <div className="text-xs text-gray-400">Always Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
