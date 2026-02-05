'use client';

import SideBoard from '@/app/components/board/SideBoard'
import ListContainer from '@/app/components/list/ListContainer';
import Button from '@/app/components/ui/Button/Button';
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
    return (
        <div className='flex'>
            <SideBoard members={MEMBERS} />

            <section className='flex-1'>
                <header className='flex justify-between items-center px-4 py-2 bg-pink-600 text-white'>
                    <h3 className=''>My Trello board</h3>

                    <button className="flex items-center gap-2 bg-black hover:bg-gray-800 px-3 py-1.5 rounded text-sm font-medium cursor-pointer">
                        <FaUserPlus size={14} />
                        <span>Invite member</span>
                    </button>
                </header>

                <main className="flex-1 overflow-x-auto overflow-y-hidden bg-white p-6">
                    <div className="flex items-start gap-6 h-full">

                        {LISTS.map((list, index) => (
                            <ListContainer key={index} title={list.title} cards={list.cards} />
                        ))}

                        <Button
                            onClick={() => { }}
                            icon={FaPlus}
                            title='Add another list'
                            style='min-w-[100px] flex-1 flex justify-start gap-2 text-white px-4 py-3 rounded-xl bg-pink-400 hover:bg-pink-600'
                        />

                    </div>
                </main>
            </section>
        </div>
    )
}

export default BoardPage