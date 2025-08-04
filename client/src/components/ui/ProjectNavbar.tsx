"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

function ProjectNavbar({ onTabChange }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('Chat')
  const tabs = ["Chat", 'Overview', 'Knowledge Base']
  
  const handleTabClick = (tab) => {
    setActiveTab(tab)
    onTabChange(tab)
  }

  return (
    <>
      <button
        onClick={() => router.push('/dashboard')}
        className="fixed top-[2%] left-[1%] bg-[#191919] border border-[#3c3c3c] p-2 rounded-full text-white hover:bg-[#252525] transition-colors duration-200 z-200"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="fixed bg-[#191919] border border-[#4a4a4a] p-2   rounded-full top-[1%] left-1/2 -translate-x-1/2 z-200 w-[310px]">
        <div className="flex gap-1 justify-center overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`px-4 py-2 cursor-pointer rounded-full text-xs transition-colors duration-200 whitespace-nowrap ${
                tab === activeTab
                  ? 'bg-[#ffffff] text-black '
                  : 'text-white hover:text-gray-200'
              }`}
            >
              <span className={tab === activeTab ? 'font-semibold' : ''}>
                {tab}
              </span>
            </button>
          ))}
        </div>
        
        {/* Custom Styles */}
        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </>
  )
}

export default ProjectNavbar