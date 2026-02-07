'use client'

import { useAcceptInvitation, useDeclineInvitation, useGetInvitations } from "@/hooks/useInvitation";
import { useUser } from "@/provider/UserProvider";
import { InvitationWithSenderName } from "@/types/Invitation";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { BiBell, BiCheck, BiX } from "react-icons/bi"
import Avatar from "../ui/Avatar";
import { useRouter } from "next/navigation";

function HeaderBar() {
    const router = useRouter();
    const user = useUser();

    if (!user) {
        router.push('/auth');
        return null;
    }

    const { data: invitations } = useGetInvitations(user?.id || '');

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

    const acceptInvite = useAcceptInvitation();
    const declineInvite = useDeclineInvitation();


    const handleAcceptInvitation = (invitation: InvitationWithSenderName) => {
        acceptInvite.mutate({ inviteId: invitation.id }, {
            onSuccess: () => {
                alert("Invitation accepted successfully");
            }
        })
    }

    const handleRejectInvitation = (invitation: InvitationWithSenderName) => {
        declineInvite.mutate({ inviteId: invitation.id }, {
            onSuccess: () => {
                alert("Invitation declined successfully");
            }
        })
    }


    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        const queryClient = useQueryClient();
        queryClient.setQueryData(["user"], null);

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
                        <div ref={notifRef} className="absolute z-50 right-0 mt-2 w-80 bg-white text-gray-800 rounded shadow-lg border border-gray-200 overflow-hidden">
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
                    <div className="peer cursor-pointer">
                        <Avatar user={user} />
                    </div>
                    <ul className="z-50 absolute right-0 bg-gray-700 hidden peer-hover:block hover:block hover:bg-gray-600 rounded-sm p-1 min-w-[100px]">
                        <li onClick={handleLogout} className="cursor-pointer py-1 px-3 text-center">Logout</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default HeaderBar