"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import { LucideBookOpen } from 'lucide-react'; // Importing Lucide icon for documentation link

interface User {
    avatar: string;
    fullName: string;
}

interface NavbarProps {
    user: User;
}

function Navbar({ user }: NavbarProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <nav className="flex justify-between pt-4 w-[98%]">
            {/* Logo */}
            <div className="text-xl font-bold">
                <Image src="/logo.svg" alt="Logo" width={120} height={120} />
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
                <button className="flex items-center cursor-pointer gap-2 text-gray-400 text-sm hover:text-white transition-colors">
                    <LucideBookOpen /> Documentation
                </button>

                <button className="text-gwhite cursor-pointer text-sm border-[1px] px-3 py-2 rounded-md border-[#252525] bg-[#090909] transition-colors">
                    Feedback
                </button>

                {/* Profile Section */}
                <div className="relative p-2 border-[1px] rounded-full border-[#252525] bg-[#090909]">
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={toggleDropdown}
                    >
                        <Image
                            src={user.avatar}
                            alt="User Avatar"
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                    </div>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-[#0A0A0A] rounded-xl border-[1px] border-[#2a2a2a] shadow-lg">
                            <ul className="py-2">
                                <li className="px-4 py-2 m-2 rounded-md hover:bg-[#1c1c1c] cursor-pointer">
                                    View Profile
                                </li>
                                <li className="px-4 py-2 m-2 rounded-md hover:bg-[#1c1c1c] cursor-pointer">
                                    Logout
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
