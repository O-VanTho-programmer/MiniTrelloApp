'use client';

import SideBoard from '@/app/components/board/SideBoard'
import FormNewList from '@/app/components/card/FormNewCard';
import { useCreateCard, useGetCardsByBoardId } from '@/hooks/useCards';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaPlus, FaUserPlus } from 'react-icons/fa';
import CardContainer from '@/app/components/card/CardContainer';
import { useGetMembers, useUpdateStatusBoard } from '@/hooks/useBoards';
import { useSendInvitation } from '@/hooks/useInvitation';
import InviteMember from '@/app/components/board/InviteMember';
import { User } from '@/types/User';
import { getUserByEmailSearch } from '@/services/auth';
import { DragDropContext } from '@hello-pangea/dnd';
import { useQueryClient } from '@tanstack/react-query';
import { Task } from '@/types/Task';
import { useDragAndDropMoveTask } from '@/hooks/useTasks';
import { socket } from '@/lib/socket';

function BoardPage() {
    const { id } = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: membersInBoard } = useGetMembers(id as string);
    const { data: cards, isLoading: isLoadingCards, isError: isErrorCards, error: errorCards } = useGetCardsByBoardId(id as string);

    const [isCreatingList, setIsCreatingList] = useState(false);
    const [openInviteMembers, setOpenInviteMember] = useState(false);

    const createCard = useCreateCard();
    const updateStatusBoard = useUpdateStatusBoard();
    const sendInvite = useSendInvitation();

    useEffect(() => {
        socket.connect();

        socket.emit("join_board", id);

        socket.on("task_move", () => {
            queryClient.invalidateQueries({ queryKey: ["cards_by_board_id", id as string] });
        });

        socket.on("update_task", (cardId: string) => {
            console.log("update_task", cardId);
            queryClient.invalidateQueries({ queryKey: ["cards_by_board_id", id as string] });

        });

        return () => {
            socket.emit('leave_board', id as string);
            socket.off('task_moved');
            socket.off('update_task');
            socket.disconnect();
        };
    }, [id, queryClient])

    const handleCreateCard = (name: string) => {
        if (!confirm("Are you sure you want to close this board?")) return;

        createCard.mutate({ name, board_id: id as string }, {
            onSuccess: () => {
                alert('Card created successfully');
            }
        })
    }

    const handleCloseBoard = () => {
        updateStatusBoard.mutate({ id: id as string, isActive: false }, {
            onSuccess: () => {
                alert('Board closed successfully');
                router.push('/boards');
            }
        })
    }

    const handleSendInvite = (receiveIds: string[]) => {
        if (receiveIds.length === 0) return;

        receiveIds.forEach((receiveId) => {
            sendInvite.mutate({ boardId: id as string, receiveId }, {
                onSuccess: () => {
                    console.log(`Invite sent to ${receiveId}`);
                },
                onError: () => {
                    alert(`Failed to send invite to user ID: ${receiveId}`);
                }
            });
        });

        alert(`Sent invitations`);
        setOpenInviteMember(false);
        setSearchedUsers(null);
    }

    const [searchedUsers, setSearchedUsers] = useState<User[] | null>(null);
    const [isSearching, setIsSearching] = useState<boolean>(false);

    const handleSearchUserByEmail = async (email: string) => {
        if (!email.trim()) return;
        setIsSearching(true);

        try {
            const searchedUsers = await getUserByEmailSearch(email);
            setSearchedUsers(searchedUsers || []);
        } catch (error) {
            setSearchedUsers([]);
            console.error('Error searching users:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const moveTask = useDragAndDropMoveTask();

    const handleDragEnd = (result: any) => {
        const { destination, source, draggableId: taskId } = result;

        if (!destination) return;

        const sourceCardId = source.droppableId;
        const prevIndexOfTask = source.index;

        const destinationCardId = destination.droppableId;
        const newIndexOfTask = destination.index;

        if (sourceCardId === destinationCardId) {
            if (prevIndexOfTask !== newIndexOfTask) {
                const tasksInCard = queryClient.getQueryData<Task[]>(['tasks_by_card_id', sourceCardId]) || [];

                let newTasksInCard = [...tasksInCard];

                const taskInPrevIndex = tasksInCard[prevIndexOfTask];
                newTasksInCard.splice(prevIndexOfTask, 1);
                newTasksInCard.splice(newIndexOfTask, 0, taskInPrevIndex);

                queryClient.setQueryData(['tasks_by_card_id', sourceCardId], newTasksInCard);
            }
        } else {
            const tasksInSourceCard = queryClient.getQueryData<Task[]>(['tasks_by_card_id', sourceCardId]) || [];
            const tasksInDesCard = queryClient.getQueryData<Task[]>(['tasks_by_card_id', destinationCardId]) || [];

            let newTasksInSourceCard = [...tasksInSourceCard];
            let newTasksInDesCard = [...tasksInDesCard];

            const taskInPrevIndex = tasksInSourceCard[prevIndexOfTask];
            newTasksInSourceCard.splice(prevIndexOfTask, 1);

            newTasksInDesCard.splice(newIndexOfTask, 0, taskInPrevIndex);

            queryClient.setQueryData(['tasks_by_card_id', sourceCardId], newTasksInSourceCard);
            queryClient.setQueryData(['tasks_by_card_id', destinationCardId], newTasksInDesCard);
        }

        moveTask.mutate({ id: taskId, sourceCardId, destinationCardId, newIndex: newIndexOfTask }, {
            onSuccess: () => {
                console.log('Task moved successfully');
            },
            onError: (error) => {
                console.error('Error moving task:', error);
            }
        });

        socket.emit("task_move", id);
    }

    return (
        <div className='flex'>
            <SideBoard
                onCloseBoard={handleCloseBoard}
                members={membersInBoard} />
            <section className='flex-1 overflow-scroll'>
                <header className='flex justify-between items-center px-4 py-2 bg-pink-600 text-white'>
                    <h3 className=''>My Trello board</h3>

                    <button onClick={() => setOpenInviteMember(true)} className="flex items-center gap-2 bg-black hover:bg-gray-800 px-3 py-1.5 rounded text-sm font-medium cursor-pointer">
                        <FaUserPlus size={14} />
                        <span>Invite member</span>
                    </button>

                </header>

                <main className="flex-1 overflow-x-auto overflow-y-hidden h-full bg-white p-6">
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <div className="flex items-start gap-6 h-full">

                            {cards?.map((card, index) => (
                                <CardContainer key={index} name={card.name} card_id={card.id} />
                            ))}

                            <div className="min-w-[200px] max-w-72 transition-all duration-200">
                                {isCreatingList ? (
                                    <FormNewList isOpen={isCreatingList}
                                        onClose={() => setIsCreatingList(false)}
                                        onSubmit={handleCreateCard}
                                        title='Add Card' />
                                ) : (
                                    <button
                                        onClick={() => setIsCreatingList(true)}
                                        disabled={createCard.isPending}
                                        className="w-full cursor-pointer flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-3 rounded-xl shadow-md transition font-medium text-sm text-left"
                                    >
                                        {!createCard.isPending && <FaPlus />}
                                        {createCard.isPending ? "Creating..." : "Add a card"}
                                    </button>
                                )}
                            </div>

                        </div>
                    </DragDropContext>
                </main>
            </section>

            {openInviteMembers && (
                <InviteMember
                    isSearching={isSearching}
                    searchedUsers={searchedUsers}
                    onSearch={handleSearchUserByEmail}
                    onSend={handleSendInvite}
                    onClose={() => setOpenInviteMember(false)}
                    alreadyMembers={membersInBoard || []}
                />
            )}
        </div>
    )
}

export default BoardPage