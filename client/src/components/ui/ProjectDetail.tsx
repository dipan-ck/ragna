"use client"

import React, { useState } from 'react'
import ProjectNavbar from './ProjectNavbar'
import OverviewSection from './OverviewSection'
import KnowledgeBaseSection from './KnowledgeBaseSection'
import ChatSection from '../chats/chat-section'


export default function ProjectDetail({ data }) {
  const [activeTab, setActiveTab] = useState('Chat')
  
  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return <OverviewSection project={data} />
      case 'Knowledge Base':
        return <KnowledgeBaseSection project={data}/>
        case "Chat":
          return <ChatSection project={data}/>
    }
  }

  return (
    <div className='w-full relative '>
      {/* <div className="flex items-center gap-4 mb-0 ml-12">
        <button 
          onClick={() => router.push('/dashboard')}
          className="p-2 text-sm text-white cursor-pointer rounded-md hover:bg-[#1e1e1e] transition-colors"
        >
          <ArrowLeft />
        </button>
        <h1 className="text-xl font-medium text-white tracking-tighter">{data.name}</h1>
        <div className="flex items-center gap-2">
          {data.status === "active" ? (
            <span className="flex items-center px-2 py-[4px] rounded-full text-xs font-medium border-[1px] border-[#2194FF] bg-[#0a1526] text-[#2194FF]">
              <LineChart className="w-3 h-3 mr-1" />
              {data.status}
            </span>
          ) : (
            <span className="px-2 py-[4px] rounded-full text-xs font-medium border-[1px] border-[#ca3838] bg-[#260a0c] text-[#ca3838]">
              {data.status}
            </span>
          )}
          <span className="px-3 py-[5px] rounded-full text-xs font-medium bg-[#16171b00] text-[#ffffff] border border-[#303030]">
            {data.model}
          </span>
        </div>
      </div> */}
      
      <ProjectNavbar onTabChange={handleTabChange} />
      
      {/* Content Area with Smooth Transition */}
      <div className="relative overflow-hidden">
        <div 
          key={activeTab}
          className="content-slide-in"
        >
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}