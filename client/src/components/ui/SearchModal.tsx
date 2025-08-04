'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, User, LogOut, FolderKanban } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchItem {
  id: string;
  heading: string;
  link: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const searchItems: SearchItem[] = [
  { id: 'profile', heading: 'Profile', link: '/profile', icon: User },
  { id: 'dashboard', heading: 'Dashboard', link: '/dashboard', icon: FolderKanban },
  { id: 'logout', heading: 'Log Out', link: '/logout', icon: LogOut },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: { id: string; name: string; _id: string }[];
}

export default function SearchModal({ isOpen, onClose, projects }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [show, setShow] = useState(isOpen);
  const [animate, setAnimate] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      setTimeout(() => setAnimate(true), 10);
    } else if (show) {
      setAnimate(false);
      const timeout = setTimeout(() => setShow(false), 250);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!show) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [show, onClose]);

  useEffect(() => {
    if (!isOpen) setSearchQuery('');
  }, [isOpen]);

  const handleItemClick = (link: string) => {
    router.push(link);
    onClose();
  };

  const filteredItems = searchItems.filter(item =>
    item.heading.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-colors duration-300 ${
        animate ? 'bg-black/40' : 'bg-black/0 pointer-events-none'
      }`}
    >
      <div
        ref={modalRef}
        className={`bg-[#0a0a0a] border border-[#2a2a2a] shadow-2xl backdrop-blur-md rounded-3xl w-full max-w-xl mx-4 p-6 max-h-[85vh] overflow-y-auto transition-all duration-300 ${
          animate ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-white text-xl font-semibold">Search</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#1a1a1a] text-gray-400 hover:text-white transition"
            aria-label="Close modal"
          >
            <X size={22} />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input
            autoFocus
            placeholder="Search pages, projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121212] border border-[#3a3a3a] rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#1f1f1f] outline-none transition"
          />
        </div>

        {/* Filtered Items */}
        <div className="space-y-4">
          {filteredItems.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-2 px-2 uppercase tracking-wide">Pages</p>
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.link)}
                  className="w-full flex items-center gap-4 py-3 px-4 rounded-xl text-white hover:bg-[#1a1a1a] group transition"
                >
                  <item.icon size={20} className="text-gray-300 group-hover:text-[#2e77ff]" />
                  <span className="text-sm font-medium group-hover:text-gray-100">{item.heading}</span>
                  <span className="ml-auto text-xs text-gray-500">{item.link}</span>
                </button>
              ))}
            </div>
          )}

          {projects.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-2 px-2 uppercase tracking-wide">Projects</p>
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleItemClick(`/project/${project._id}`)}
                  className="w-full flex items-center gap-4 py-3 px-4 rounded-xl text-white hover:bg-[#1a1a1a] group transition"
                >
                  <FolderKanban size={20} className="text-gray-300 group-hover:text-[#2e77ff]" />
                  <span className="text-sm font-medium group-hover:text-gray-100">{project.name}</span>
                  <span className="ml-auto text-xs text-gray-500">{`project/${project._id}`}</span>
                </button>
              ))}
            </div>
          )}

          {filteredItems.length === 0 && projects.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-6">No results found</p>
          )}
        </div>
      </div>
    </div>
  );
}
