'use client';

import SideBoard from '@/app/components/board/SideBoard'
import FormNewList from '@/app/components/list/FormNewCard';
import { useCreateCard, useGetCardsByBoardId } from '@/hooks/useCards';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaPlus, FaUserPlus } from 'react-icons/fa';
import CardContainer from '@/app/components/list/CardContainer';
import { useGetMembers, useUpdateStatusBoard } from '@/hooks/useBoards';

function BoardPage() {
    const { id } = useParams();
    const router = useRouter();

    const {data: membersInBoard} = useGetMembers(id as string);
    const { data: cards, isLoading: isLoadingCards, isError: isErrorCards, error: errorCards } = useGetCardsByBoardId(id as string);

    const [isCreatingList, setIsCreatingList] = useState(false);

    const createCard = useCreateCard();
    const updateStatusBoard = useUpdateStatusBoard();

    const handleCreateCard = (name: string) => {
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

    return (
        <div className='flex'>
            <SideBoard
                onCloseBoard={handleCloseBoard}
                members={membersInBoard} />
            <section className='flex-1 overflow-scroll'>
                <header className='flex justify-between items-center px-4 py-2 bg-pink-600 text-white'>
                    <h3 className=''>My Trello board</h3>

                    <button className="flex items-center gap-2 bg-black hover:bg-gray-800 px-3 py-1.5 rounded text-sm font-medium cursor-pointer">
                        <FaUserPlus size={14} />
                        <span>Invite member</span>
                    </button>
                </header>

                <main className="flex-1 overflow-x-auto overflow-y-hidden h-full bg-white p-6">
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
                </main>
            </section>
        </div>
    )
}

export default BoardPage