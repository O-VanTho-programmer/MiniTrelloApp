'use client';

import SideBoard from '@/app/components/board/SideBoard'
import FormNewList from '@/app/components/list/FormNewList';
import ListContainer from '@/app/components/list/ListContainer';
import Button from '@/app/components/ui/Button/Button';
import { useGetBoardById } from '@/hooks/useBoards';
import { useCreateList, useGetListsByBoardId } from '@/hooks/useLists';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { FaPlus, FaUserPlus } from 'react-icons/fa';

const LISTS = [
    { title: 'To do', cards: [] },
    { title: 'Doing', cards: [] },
    { title: 'Done', cards: [] },
];

const MEMBERS = [
    { id: 1, name: 'User 1', avatar: 'SD', color: 'bg-red-600' },
    { id: 2, name: 'User 2', avatar: 'SD', color: 'bg-orange-600' },
    { id: 3, name: 'User 3', avatar: 'SD', color: 'bg-yellow-600' },
    { id: 4, name: 'User 4', avatar: 'SD', color: 'bg-red-500' },
];

function BoardPage() {
    const { id } = useParams();

    const { data: board, isLoading, isError, error } = useGetBoardById(id as string);
    const { data: lists, isLoading: isLoadingLists, isError: isErrorLists, error: errorLists } = useGetListsByBoardId(id as string);

    console.log(lists);

    const [isCreatingList, setIsCreatingList] = useState(false);

    const createList = useCreateList();

    const handleCreateList = (name: string) => {
        createList.mutate({ name, board_id: id as string }, {
            onSuccess: () => {
                alert('List created successfully');
            }
        })
    }
    return (
        <div className='flex'>
            <SideBoard members={MEMBERS} />

            <section className='flex-1 overflow-scroll'>
                <header className='flex justify-between items-center px-4 py-2 bg-pink-600 text-white'>
                    <h3 className=''>My Trello board</h3>

                    <button className="flex items-center gap-2 bg-black hover:bg-gray-800 px-3 py-1.5 rounded text-sm font-medium cursor-pointer">
                        <FaUserPlus size={14} />
                        <span>Invite member</span>
                    </button>
                </header>

                <main className="flex-1 overflow-x-auto overflow-y-hidden bg-white p-6">
                    <div className="flex items-start gap-6 h-full">

                        {lists?.map((list, index) => (
                            <ListContainer key={index} title={list.name} list_id={list.id} cards={list.cards || []} />
                        ))}

                        <div className="min-w-[100px] shrink-0 transition-all duration-200">
                            {isCreatingList ? (
                                <FormNewList isOpen={isCreatingList}
                                    onClose={() => setIsCreatingList(false)}
                                    onSubmit={handleCreateList} />
                            ) : (
                                <button
                                    onClick={() => setIsCreatingList(true)}
                                    className="w-full cursor-pointer flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-3 rounded-xl shadow-md transition font-medium text-sm text-left"
                                >
                                    <FaPlus />
                                    Add another list
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