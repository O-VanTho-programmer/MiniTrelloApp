'use client';

import { useState } from "react";
import { User } from "@/types/User";
import { FaUserFriends, FaBars, FaTimes, FaChevronLeft } from "react-icons/fa";
import Avatar from "../ui/Avatar";
import { useRouter } from "next/navigation";

type SideBoardProps = {
    members: User[] | undefined;
    onCloseBoard: () => void;
}

export default function SideBoard({ members = [], onCloseBoard }: SideBoardProps) {
    const router = useRouter();
    const [isOpenMobile, setIsOpenMobileMobile] = useState(false);

    return (
        <>
            {/* Open for Mobile */}
            {!isOpenMobile && (
                <button
                    onClick={() => setIsOpenMobileMobile(true)}
                    className="md:hidden fixed top-20 left-0 z-30 bg-black text-gray-300 p-2 rounded-r-md shadow-md border-y border-r border-gray-700 hover:text-white transition-all"
                    aria-label="Open Sidebar"
                >
                    <FaBars size={16} />
                </button>
            )}

            {isOpenMobile && (
                <div onClick={() => setIsOpenMobileMobile(false)} className="modal z-10!"></div>
            )}

            <nav className={`
                fixed md:relative top-0 w-72 z-40 h-full flex flex-col bg-gray-900 text-gray-300 border-r border-gray-700 transition-transform duration-300 ease-in-out 
                ${isOpenMobile ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            `}>
                <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                    <div onClick={() => router.push('/boards')} className="cursor-pointer flex items-center gap-2 font-semibold text-gray-100 hover:opacity-80 transition">
                        <span className="w-6 h-6 bg-pink-600 rounded text-xs flex items-center justify-center">T</span>
                        My board
                    </div>

                    {/* Close Button Mobile */}
                    <button
                        onClick={() => setIsOpenMobileMobile(false)}
                        className="md:hidden text-gray-400 hover:text-white p-1 rounded-md hover:bg-white/10"
                    >
                        <FaChevronLeft size={14} />
                    </button>
                </div>

                <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="flex items-center gap-2 mb-4 text-sm font-medium text-gray-400">
                        <FaUserFriends />
                        <span>Members</span>
                    </div>

                    <div className="space-y-2">
                        {members.map((mem) => (
                            <div key={mem.id} className="flex items-center gap-3 cursor-pointer hover:bg-white/10 p-2 rounded-lg transition group">
                                <Avatar user={mem} />
                                <span className="text-sm font-medium text-gray-200 group-hover:text-white">{mem.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 mt-auto border-t border-gray-700/50">
                    <p className="mb-3 text-xs text-gray-500 leading-relaxed">
                        You can't find and reopen closed boards if close the board.
                    </p>
                    <button onClick={onCloseBoard} className="w-full cursor-pointer bg-gray-800 hover:bg-red-500 hover:text-white text-red-500 border border-red-500/50 py-2 px-4 rounded font-medium text-sm transition-all shadow-sm">
                        Close Board
                    </button>
                </div>
            </nav>
        </>
    );
}