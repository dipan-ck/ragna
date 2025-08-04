import Image from "next/image"

export default function KnowledgeBase() {
  return (
    <section className="py-32 px-6 border-t border-gray-800 relative overflow-hidden">

<div className="w-180 h-130 absolute right-[0%] top-[25%]  bg-[radial-gradient(at_top_left,#ff4500,#ff0000,#ff00ff,#800080,#0000ff,#000033)] rounded-lg blur-3xl transform group-hover:scale-110 transition-transform duration-200"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5">
            <div className="inline-flex items-center px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full mb-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse"></div>
              <span className="text-sm text-gray-300">Knowledge Base</span>
            </div>

            <h2 className="text-4xl  mb-6 text-white font-medium tracking-tighter">
              Transform documents into
              <br />
                intelligent knowledge

            </h2>

            <p className="text-base text-[#9f9f9f]  mb-12 ">
              Upload any document format and watch as our AI automatically processes, chunks, and vectorizes your
              content for lightning-fast semantic search and retrieval.
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 gap-6 mb-12">
              <div className="group">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <h4 className=" tracking-tighter text-white mb-2">Smart Upload</h4>
                <p className="text-sm text-[#9f9f9f]">Drag & drop with automatic format detection</p>
              </div>

              <div className="group">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="tracking-tighter text-white mb-2">Instant Processing</h4>
                <p className="text-sm text-[#9f9f9f]">Real-time vectorization and indexing</p>
              </div>

              <div className="group">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h4 className="ftracking-tighter text-white mb-2">Secure Storage</h4>
                <p className="text-sm text-[#9f9f9f]">Isolated knowledge bases per project</p>
              </div>

              <div className="group">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h4 className="tracking-tighter text-white mb-2">Semantic Search</h4>
                <p className="text-sm text-[#9f9f9f]">AI-powered content discovery</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-8 text-sm">
              <div>
                <span className="text-2xl font-bold text-white">10MB</span>
                <p className="text-[#9f9f9f]">Max file size</p>
              </div>
              <div>
                <span className="text-2xl font-bold text-white">4</span>
                <p className="text-[#9f9f9f]">File formats</p>
              </div>
              <div>
                <span className="text-2xl font-bold text-white">&lt;5s</span>
                <p className="text-[#9f9f9f]">Processing time</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative">
              {/* Floating Elements */}
              <div className="absolute -top-8 -left-8 w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl backdrop-blur flex items-center justify-center">
                <span className="text-blue-400 font-semibold text-sm">PDF</span>
              </div>
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-xl backdrop-blur flex items-center justify-center">
                <span className="text-green-400 text-xs">✓</span>
              </div>

              {/* Main Image Container */}
              <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur border border-gray-700/50 rounded-3xl p-2 shadow-2xl">
                <div className="relative overflow-hidden rounded-2xl">
                  <Image
                    src="/screenshot/knowledge-base.png"
                    alt="Knowledge Base Interface"
                    width={800}
                    height={500}
                    className="w-full h-auto"
                  />

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>

                {/* Processing Indicator */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-black/80 backdrop-blur border border-gray-700 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Processing documents...</span>
                      <span className="text-sm text-gray-400">3/4 complete</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full w-3/4 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Stats */}
              <div className="absolute -bottom-8 -right-8 bg-black/80 backdrop-blur border border-gray-700 rounded-2xl p-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-400">847</div>
                  <div className="text-xs text-gray-400">Chunks created</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
