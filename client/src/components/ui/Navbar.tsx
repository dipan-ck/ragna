'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { LucideBell, LucideSearch } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/hooks/useUser';
import NavbarSkeleton from '../skeleton/NavbarSkeleton';
import SearchModal from './SearchModal';
import { useNotificationUnreadCheck } from '@/lib/hooks/useNotificationUnreadCheck';
import NotificationModal from './NotificationModal';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

function Navbar({projects}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const { data, isLoading } = useUser();
  const { data: hasUnread, isLoading: isNotifLoading } = useNotificationUnreadCheck();



  

  const router = useRouter();

  const toggleDropdown = () => setDropdownOpen(prev => !prev);
  const toggleNotificationModal = () => setIsNotificationModalOpen(prev => !prev);

  const handleSearchClick = () => setIsSearchModalOpen(true);
  const handleCloseSearchModal = () => setIsSearchModalOpen(false);

  const handleLogout = async () => {
    const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/logout`, {
      credentials: 'include',
    });
    if (req.ok) router.push('/auth/login');
  };

  if (isLoading) return <NavbarSkeleton />;

  return (
    <>
      <nav className="flex justify-between items-center border-b-1 z-20 border-[#1a1a1a] py-1 w-full px-4">
        {/* Logo */}
        <div className="text-xl font-bold">
          <Image src="/logo.svg" alt="Logo" width={35} height={35} />
        </div>

        <div className="flex items-center gap-6">

<Link 
  href="https://github.com/dipan-ck/ragna"
  target="_blank"
  className="px-[12px] py-[6px] bg-[#090909] border-[1px] rounded-full border-[#252525] text-sm hover:bg-[#000000] cursor-pointer flex items-center gap-2"
>
  <svg height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
  </svg>
  GitHub
</Link>


{/* <div 
  className="px-[12px] py-[6px] bg-[radial-gradient(at_top_left,#4F46E5,#7C3AED,#C026D3,#DB2777,#F59E0B)] rounded-full text-sm cursor-pointer hover:opacity-90 transition-all duration-300 flex items-center gap-2"
>
  <Sparkles className="w-4 h-4" />
  {data?.plan || 'Free'}
</div> */}
          {/* Search */}
          <div
            className="flex items-center border-[1px] rounded-xl border-[#252525] bg-[#090909] px-2 py-1 w-40 cursor-pointer"
            onClick={handleSearchClick}
            tabIndex={0}
          >
            <LucideSearch className="text-gray-400 w-4" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-gray-400 text-sm ml-2 outline-none w-full cursor-pointer"
              onClick={handleSearchClick}
              readOnly
              tabIndex={-1}
              aria-label="Search"
            />
            <span
              className="ml-2 flex items-center justify-center bg-[#181818] border border-[#252525] rounded px-1.5 py-0.5 text-xs text-gray-400 font-mono select-none"
              title="Press F to search"
            >
              F
            </span>
          </div>

          {/* Notifications */}
          <div
            onClick={toggleNotificationModal}
            className="relative p-1 border-[1px] rounded-full border-[#252525] bg-[#090909] cursor-pointer"
          >
            <LucideBell className="text-gray-400" />
            {!isNotifLoading && hasUnread && (
  <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full"></span>
)}

          </div>

          {/* User Avatar */}
          <div className="relative p-1 border-[1px] rounded-full border-[#252525] bg-[#090909]">
            <div className="flex items-center gap-2 cursor-pointer" onClick={toggleDropdown}>
              <Image
                src={data?.avatar || '/default-user-avatar.svg'}
                alt="User Avatar"
                width={35}
                height={35}
                className="rounded-full h-[35px] object-cover"
              />
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-[#0A0A0A] rounded-xl border-[1px] border-[#2a2a2a] shadow-lg">
                <ul className="py-2">
                  <li onClick={() => router.push('/profile')} className="px-4 py-2 m-2 rounded-md hover:bg-[#1c1c1c] cursor-pointer">
                    View Profile
                  </li>
                  <li onClick={handleLogout} className="px-4 py-2 m-2 rounded-md hover:bg-[#1c1c1c] cursor-pointer">
                    Logout
                  </li>
                  <li onClick={() => router.push('/feedback')} className="px-4 py-2 m-2 rounded-md hover:bg-[#1c1c1c] cursor-pointer">
                    Feedback
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Modals */}
      <SearchModal isOpen={isSearchModalOpen} projects={projects} onClose={handleCloseSearchModal} />
      <NotificationModal isOpen={isNotificationModalOpen} onClose={() => setIsNotificationModalOpen(false)} />
    </>
  );
}

export default Navbar;
