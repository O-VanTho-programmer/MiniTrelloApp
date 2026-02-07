'use client'

import { useGetInvitations } from "@/hooks/useInvitation";
import { InvitationWithSenderName } from "@/types/Invitation";
import { useEffect, useRef, useState } from "react";
import { BiBell, BiCheck, BiX } from "react-icons/bi"

function HeaderBar() {

    const {data: invitations} = useGetInvitations();

    const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setIsNotifMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [])

    const handleAcceptInvitation = (invitation: InvitationWithSenderName) => {
    }

    const handleRejectInvitation = (invitation: InvitationWithSenderName) => {
    }


    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth';
    }

    return (
        <div className="min-h-[50px] text-white flex items-center justify-between px-4 py-2 bg-gray-700">
            <span>
                Logo
            </span>

            <div className="flex items-center gap-4">
                <div className="relative">
                    <button onClick={() => setIsNotifMenuOpen(!isNotifMenuOpen)} className="cursor-pointer">
                        <BiBell size={16} />
                    </button>
                    {isNotifMenuOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-white text-gray-800 rounded shadow-lg border border-gray-200 overflow-hidden">
                            <div className="px-4 py-2 border-b font-semibold bg-gray-50 text-sm">Notifications</div>
                            <div className="max-h-64 overflow-y-auto">
                                {!invitations || invitations.length === 0 ? (
                                    <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
                                ) : (
                                    invitations?.map(inv => (
                                        <div key={inv.id} className="p-3 border-b hover:bg-gray-50 transition text-sm">
                                            <p className="mb-2">
                                                <span className="font-bold">{inv.sender_name}</span> invited you to a board.
                                            </p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleAcceptInvitation(inv)}
                                                    className="flex-1 bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-700 flex items-center justify-center gap-1"
                                                >
                                                    <BiCheck /> Accept
                                                </button>
                                                <button
                                                    onClick={() => handleRejectInvitation(inv)}
                                                    className="flex-1 bg-gray-200 text-gray-700 py-1 px-2 rounded hover:bg-gray-300 flex items-center justify-center gap-1"
                                                >
                                                    <BiX /> Decline
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div className="relative">
                    <img className="peer rounded-full w-[40px] h-[40px] object-cover cursor-pointer" src={""} />

                    <ul className="absolute right-0 bg-gray-700 hidden peer-hover:block hover:block rounded-sm p-1 min-w-[100px]">
                        <li onClick={handleLogout} className="cursor-pointer py-1 px-3 text-center">Logout</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default HeaderBar