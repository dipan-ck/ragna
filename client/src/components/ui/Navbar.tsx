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

function Navbar({ user, projects }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const { data, isLoading } = useUser(user);
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
      <nav className="flex justify-between items-center border-b-1 border-[#1a1a1a] py-1 w-full px-4">
        {/* Logo */}
        <div className="text-xl font-bold">
          <Image src="/logo.svg" alt="Logo" width={35} height={35} />
        </div>

        <div className="flex items-center gap-6">
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
