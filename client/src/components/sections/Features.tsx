export default function Features() {
  return (
    <section id="features" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Essential tools for your
            <br />
            <span className="text-white font-medium tracking-tighter">AI-powered knowledge base</span>
          </h2>
          <p className="text-base text-[#9f9f9f] max-w-2xl mx-auto">
            Unlock your AI potential with Ragna's powerful suite of tools designed to drive your intelligent automation
            success.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-auto lg:h-[800px]">
          {/* Knowledge Base Management - Large Card */}
          <div className="lg:col-span-2 relative overflow-hidden border bg-transparent border-gray-800 rounded-2xl p-8 transition-colors duration-300">
           

           <div className="w-60 h-60 absolute right-[0%] top-[40%] bg-[radial-gradient(at_top_left,#ff4500,#ff0000,#ff00ff,#800080,#0000ff,#000033)] rounded-lg blur-2xl transform group-hover:scale-110 transition-transform duration-200"></div>

       
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-2xl  tracking-tighter text-white">Smart knowledge base management</h3>
                <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">Active</span>
              </div>
              <p className="text-[#9f9f9f] mb-8 max-w-md text-base">
                Upload and process multiple file formats with automatic vectorization. Your documents become searchable,
                intelligent knowledge in seconds.
              </p>

              {/* File Upload Visualization */}
              <div className="flex items-center space-x-6 mb-8">
                <div className="flex -space-x-3">
                  <div className="w-14 h-14 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center justify-center transform hover:scale-105 transition-transform duration-200">
                    <span className="text-red-400 text-sm font-semibold">PDF</span>
                  </div>
                  <div className="w-14 h-14 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center transform hover:scale-105 transition-transform duration-200">
                    <span className="text-blue-400 text-sm font-semibold">DOC</span>
                  </div>
                  <div className="w-14 h-14 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center justify-center transform hover:scale-105 transition-transform duration-200">
                    <span className="text-green-400 text-sm font-semibold">CSV</span>
                  </div>
                  <div className="w-14 h-14 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center transform hover:scale-105 transition-transform duration-200">
                    <span className="text-purple-400 text-sm font-semibold">TXT</span>
                  </div>
                </div>
                <div className="text-gray-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
                <div className="w-14 h-14 bg-white/10 border border-gray-600 rounded-xl flex items-center justify-center relative group">
                  <div className="w-8 h-8 bg-[radial-gradient(at_top_left,#ff4500,#ff0000,#ff00ff,#800080,#0000ff,#000033)] rounded-lg transform group-hover:scale-110 transition-transform duration-200"></div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span className="text-white font-semibold">4</span> files processed
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-purple-400 rounded-full"></span>
                  <span className="text-white font-semibold">2.3MB</span> vectorized
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
                  <span className="text-white font-semibold">847</span> chunks created
                </div>
              </div>
            </div>
          </div>

          {/* AI Model Selection */}
          <div className="bg-transparent border  border-gray-800 rounded-2xl p-8 relative overflow-hidden">
                    <div className="w-40 h-40 -z-10 absolute right-[0%] top-[40%] bg-[radial-gradient(at_top_left,#ff4500,#ff0000,#ff00ff,#800080,#0000ff,#000033)] rounded-lg blur-2xl transform group-hover:scale-110 transition-transform duration-200"></div>
            <h3 className=" text-2xl tracking-tighter text-white mb-4">Multiple AI models</h3>
            <p className="text-[#9f9f9f] mb-8 text-sm">
              Choose from the latest AI models for your specific use case and requirements.
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/5 border border-[#757575] rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <span className="text-sm text-white font-medium">Gemini 2.5</span>
                </div>
                <span className="text-xs text-white">Active</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#27272752] border border-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-600/20 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-400">Claude 3</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#27272752] border border-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-600/20 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-400">Gemini Pro</span>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Chat Interface */}
          <div className="bg-transparent border border-gray-800 rounded-2xl p-8 relative overflow-hidden">
                   <div className="w-40 h-40 -z-10 absolute right-[0%] top-[40%] bg-[radial-gradient(at_top_left,#ff4500,#ff0000,#ff00ff,#800080,#0000ff,#000033)] rounded-lg blur-2xl transform group-hover:scale-110 transition-transform duration-200"></div>
            <h3 className="text-medium text-2xl tracking-tighter text-white mb-4">Real-time conversations</h3>
            <p className="text-[#9f9f9f] mb-8 text-sm">
              Instant responses powered by your knowledge base with context-aware intelligence.
            </p>

            {/* Chat Simulation */}
            <div className="space-y-3">
              <div className="flex justify-end">
                <div className="bg-white rounded-lg px-3 py-2 max-w-[80%]">
                  <p className="text-xs">What's our refund policy?</p>
                </div>
              </div>

              <div className="flex justify-start">
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg px-3 py-2 max-w-[80%]">
                  <p className="text-xs text-blue-200">Based on your policy document, we offer 30-day refunds...</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>AI is typing...</span>
              </div>
            </div>

            {/* Response Time Indicator */}
            <div className="absolute bottom-4 right-4 text-xs text-gray-500">
              <span className="text-white font-semibold">0.8s</span> avg response
            </div>
          </div>

          {/* API Integration */}
          <div className="lg:col-span-2 bg-transparent border border-gray-800 rounded-2xl p-8 relative overflow-hidden">
             <div className="w-80 h-60 -z-10 absolute right-[35%] top-[70%] bg-[radial-gradient(at_top_left,#ff4500,#ff0000,#ff00ff,#800080,#0000ff,#000033)] rounded-lg blur-2xl transform group-hover:scale-110 transition-transform duration-200"></div>
            <h3 className="text-medium text-2xl tracking-tighter text-white mb-4">Seamless integration</h3>
            <p className="text-[#9f9f9f] text-sm mb-8 max-w-md">
              Easily connect your platform with your existing tools. Our seamless integration ensures smooth data flow
              across all your systems.
            </p>

            {/* Integration Flow */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12  border border-white/20 rounded-lg flex items-center justify-center " style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.1))' }}>
                  <span className="text-lg">🌐</span>
                </div>
                <span className="text-xs text-gray-400">Your App</span>
              </div>

              <div className="flex-1 flex items-center justify-center space-x-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
                <div className="w-8 h-8 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center">
                  <span className="text-blue-400 text-xs">API</span>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
              </div>

              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-black border border-gray-600 rounded-lg flex items-center justify-center">
                  <img src="/logo.svg" alt="Ragna Logo" className="w-8 h-8" />
                </div>
                <span className="text-xs text-gray-400">AI built with Ragna</span>
              </div>
            </div>

            {/* Integration Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center">
                <div className="text-medium text-white font-bold">&lt; 100ms</div>
                <div className="text-xs text-gray-400">Response time</div>
              </div>
              <div className="text-center">
                <div className="text-lg text-medium text-white">99.9%</div>
                <div className="text-xs text-gray-400">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-lg text-medium text-white">RESTful</div>
                <div className="text-xs text-gray-400">API design</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
