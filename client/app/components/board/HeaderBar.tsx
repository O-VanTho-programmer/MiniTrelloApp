'use client'

import { useAcceptInvitation, useDeclineInvitation, useDeleteInvitation, useGetInvitations } from "@/hooks/useInvitation";
import { useUser } from "@/provider/UserProvider";
import { InvitationWithSenderName } from "@/types/Invitation";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { BiBell, BiCheck, BiTrash, BiX } from "react-icons/bi"
import Avatar from "../ui/Avatar";
import { useRouter } from "next/navigation";
import Button from "../ui/Button/Button";

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

    const acceptInvite = useAcceptInvitation(user?.id || '');
    const declineInvite = useDeclineInvitation(user?.id || '');
    const deleteInvite = useDeleteInvitation(user?.id || '');


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

    const handleDeleteInvitation = (invitation: InvitationWithSenderName) => {
        deleteInvite.mutate({ inviteId: invitation.id }, {
            onSuccess: () => {
                alert("Invitation deleted successfully");
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
                        <div ref={notifRef} className="absolute z-50 right-0 mt-2 w-80 max-h-40 bg-white text-gray-800 rounded shadow-lg border border-gray-200 overflow-y-scroll">
                            <div className="px-4 py-2 border-b font-semibold bg-gray-50 text-sm">Notifications</div>
                            <div className="max-h-64 overflow-y-auto">
                                {!invitations || invitations.length === 0 ? (
                                    <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
                                ) : (
                                    invitations?.map(inv => (
                                        <div key={inv.id} className="p-3 border-b relative hover:bg-gray-50 transition text-sm">


                                            <p className="mb-2">
                                                <span className="font-bold">{inv.sender_name}</span> invited you to a board.
                                            </p>
                                            {inv.status === 'pending' ? (
                                                <div className="flex gap-2">
                                                    <Button
                                                        icon={BiCheck}
                                                        title="Accept"
                                                        style="flex-1 bg-blue-600 hover:bg-blue-700 text-white justify-center!"
                                                        onClick={() => handleAcceptInvitation(inv)}
                                                        disabled={acceptInvite.isPending}
                                                        isSaving={acceptInvite.isPending}
                                                    />
                                                    <Button
                                                        icon={BiX}
                                                        title="Decline"
                                                        style="flex-1 bg-red-600 hover:bg-red-700 text-white justify-center!"
                                                        onClick={() => handleRejectInvitation(inv)}
                                                        disabled={declineInvite.isPending}
                                                        isSaving={declineInvite.isPending}
                                                    />
                                                </div>
                                            ) : (
                                                <>
                                                    <p className="text-gray-500">{inv.status === 'accepted' ? 'Accepted' : 'Declined'}</p>
                                                    <button
                                                        onClick={() => handleDeleteInvitation(inv)}
                                                    className="absolute right-3 top-3 p-1 cursor-pointer text-gray-500 border rounded-full hover:text-red-500">
                                                        <BiTrash size={16} />
                                                    </button>
                                                </>
                                            )}
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