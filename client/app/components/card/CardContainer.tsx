import { FaPlus, FaTimes } from 'react-icons/fa'
import { useState } from 'react'
import FormNewList from './FormNewCard'
import { BiMenu } from 'react-icons/bi'
import { useDeleteCard } from '@/hooks/useCards'
import { useParams } from 'next/navigation'
import { useCreateTaskWithInCard, useDeleteTask, useGetTasksByCardId } from '@/hooks/useTasks'
import TaskItem from '../task/TaskItem'
import { TaskWithAssignedMember } from '@/types/Task'
import TaskDetailModal from '../task/TaskDetailModal'
import { Draggable, Droppable } from '@hello-pangea/dnd'

type CardContainerProps = {
    name: string
    card_id: string
}

function CardContainer({ name, card_id }: CardContainerProps) {
    const { id } = useParams();

    const { data: tasks } = useGetTasksByCardId(card_id, id as string);


    const [isCreatingTask, setIsCreatingTask] = useState(false);
    const [openSetting, setOpenSetting] = useState(false);
    const [selectedTask, setSelectedTask] = useState<TaskWithAssignedMember | null>(null);

    const deleteCardById = useDeleteCard();
    const createTask = useCreateTaskWithInCard();
    const deleteTask = useDeleteTask();

    const handleCreateTask = (name: string, description: string) => {
        createTask.mutate({ name: name, description: description, card_id, board_id: id as string }, {
            onSuccess: () => {
                alert('Task created successfully');
                setIsCreatingTask(false);
            }
        })
    }

    const handleDeleteTask = (id: string) => {
        deleteTask.mutate({ id, board_id: id as string, card_id }, {
            onSuccess: () => {
                alert('Task deleted successfully');
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
        <div className="min-w-[250px] max-w-72 flex-1 shrink-0">
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

                <Droppable droppableId={card_id} type="TASK">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`flex-1 overflow-y-auto p-2 min-h-[10px] rounded-md transition-colors ${snapshot.isDraggingOver ? 'bg-gray-500' : ''
                                }`}
                        >
                            <div className="flex flex-col gap-2">
                                {tasks?.map((task, idx) => (
                                    <Draggable key={task.id} draggableId={task.id} index={idx}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                onClick={() => setSelectedTask(task)}
                                                style={{ ...provided.draggableProps.style }}
                                                className={`${snapshot.isDragging ? 'rotate-2 shadow-xl ring-2 ring-blue-400 z-50 rounded-md' : ''}`}
                                            >
                                                <TaskItem item={task} />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        </div>
                    )}
                </Droppable>


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
            {
                selectedTask && (
                    <TaskDetailModal
                        cardName={name}
                        cardId={card_id}
                        task={selectedTask}
                        isOpen={selectedTask !== null}
                        onDelete={() => handleDeleteTask(selectedTask.id)}
                        onClose={() => setSelectedTask(null)}
                    />
                )
            }
        </div >
    )
}

export default CardContainer