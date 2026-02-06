import { FaPlus, FaTimes } from 'react-icons/fa'
import { useState } from 'react'
import FormNewList from './FormNewCard'
import { BiMenu } from 'react-icons/bi'
import { useDeleteCard } from '@/hooks/useCards'
import { useParams } from 'next/navigation'
import { useCreateTaskWithInCard, useGetTasksByCardId } from '@/hooks/useTasks'
import TaskItem from '../task/TaskItem'

type CardContainerProps = {
    name: string
    card_id: string
}

function CardContainer({ name, card_id }: CardContainerProps) {
    const { id } = useParams();

    const { data: tasks } = useGetTasksByCardId(card_id, id as string);


    const [isCreatingTask, setIsCreatingTask] = useState(false);
    const [openSetting, setOpenSetting] = useState(false);

    const deleteCardById = useDeleteCard();
    const createTask = useCreateTaskWithInCard();

    const handleCreateTask = (name: string, description: string) => {
        createTask.mutate({ name, description, card_id, board_id: id as string }, {
            onSuccess: () => {
                alert('Task created successfully');
            }
        })
    }

    const handleDeleteCard = () => {
        deleteCardById.mutate({ id: card_id, board_id: id as string }, {
            onSuccess: () => {
                alert('Card deleted successfully');
            }
        })
    }

    return (
        <div className="min-w-[100px] max-w-72 flex-1 shrink-0">
            <div className="bg-gray-800 rounded-xl p-3 shadow-sm">

                <div className='flex items-center justify-between mb-2'>
                    <h3 className="font-bold text-gray-200 text-sm">{name}</h3>
                    <div className='relative'>
                        <button onClick={() => setOpenSetting(!openSetting)} className='text-white cursor-pointer rounded-full hover:bg-gray-600 p-1'>
                            <BiMenu size={18} />
                        </button>

                        {openSetting && (
                            <div className='absolute bg-gray-600 text-white min-w-[200px] rounded-sm'>
                                <div className='flex justify-center p-2'>
                                    <span className='text-center'>List Actions</span>
                                    <button onClick={() => setOpenSetting(false)} className='absolute top-0 right-0 p-2 rounded-sm mr-1 mt-1 hover:bg-gray-400 cursor-pointer'><FaTimes /></button>
                                </div>
                                <ul>
                                    <li className='py-2 px-2 hover:bg-gray-400 cursor-pointer'>Add Task</li>
                                    <li onClick={handleDeleteCard} className='py-2 px-2 hover:bg-gray-400 cursor-pointer'>Delete</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <div className="max-h-[70vh] overflow-y-auto flex flex-col gap-2">
                    {tasks?.map((task, idx) => (
                        <TaskItem key={idx} item={task} />
                    ))}
                </div>


                <div className='w-full'>
                    {isCreatingTask ? (
                        <FormNewList isOpen={isCreatingTask}
                            onClose={() => setIsCreatingTask(false)}
                            onSubmit={handleCreateTask}
                            title='Add Task' />
                    ) : (
                        <button
                            onClick={() => setIsCreatingTask(true)}
                            className="w-full flex items-center gap-2 text-gray-400 hover:text-gray-100 hover:bg-gray-700 py-2 px-2 rounded-lg text-sm mt-1 cursor-pointer"
                        >
                            <FaPlus size={12} />
                            Add a task
                        </button>
                    )}
                </div>

            </div>
        </div>
    )
}

export default CardContainer