import React from 'react'

function Footer() {
  return (
    <footer className=" text-[#656565] mt-20 py-6">
      <div className="container mx-auto text-center">
        <p className="mb-2">Developed with ❤️ by Dipan Ckaraborty</p>
        <div className="flex justify-center gap-4">
          <a 
            href="https://x.com/DipanCk" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 transition-colors"
          >
            Twitter
          </a>
          <a 
            href="https://github.com/dipan-ck" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
