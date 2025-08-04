import Image from "next/image"

export default function Hero() {



  return (
    <section className="relative bg-transparent min-h-screen flex items-center justify-center px-6 overflow-hidden">

      <div className="absolute 50 inset-0 w-full  h-full">
        <Image
          src="/circles.svg"
          alt="Stars Background"
          fill
          className="object-cover opacity-50"
          priority
        />
      </div>

      <div className="w-240 h-130 absolute right-[20%] top-[48%]  bg-[radial-gradient(at_top_left,#ff4500,#ff0000,#ff00ff,#800080,#0000ff,#000033)] rounded-lg blur-2xl transform group-hover:scale-110 transition-transform duration-200"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Navigation */}
        <nav className="absolute top-0 left-0 right-0 flex justify-between items-center py-8">
          <div className="flex items-center space-x-3">
            <Image
              src="/logo.svg"
              alt="Ragna Logo"
              width={32}
              height={32}
              className="rounded-md"
            />
            <span className="text-xl font-medium tracking-tighter text-white">Ragna</span>
          </div>
          <div className="flex items-center space-x-8">
            <a 
              href="/feedback" 
              className="flex items-center gap-2 text-sm px-4 py-2 text-white border border-white/20 rounded-xl hover:bg-white/10 transition-all duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"/>
              </svg>
              Feedback
            </a>
   
            <a 
              href="/auth/signup"
              className="bg-white text-black px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Get Started
            </a>
          </div>
        </nav>

        {/* Hero content */}
        <div className="text-center mt-32">
          <h1 className="text-6xl md:text-7xl font-medium tracking-tighter mb-8 leading-tight text-white">
            Build AI agents <br/> with your own data
          </h1>

          <p className="text-base text-[#b9b9b9] mb-12 max-w-2xl mx-auto leading-relaxed">
            Create intelligent AI assistants powered by your documents. Upload files, train models, and deploy custom
            agents that understand your specific knowledge base.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <a 
              href="/auth/signup"
              className="bg-white text-black px-8 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors"
            >
              Start Building
            </a>
            <a 
              href="https://github.com/dipan-ck/ragna" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 px-6 py-3 text-white border border-white/20 hover:border-white rounded-xl bg-white/10 transition-all duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub Repo
            </a>
          </div>

          {/* Hero Image */}
          <div className="relative max-w-5xl z-200 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
            <div className="   rounded-2xl overflow-hidden  ">
              <Image
                src="/screenshot/dashboard.png"
                alt="Ragna Dashboard"
                width={1200}
                height={700}
                className="w-full  h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
