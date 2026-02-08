import { User } from '@/types/User'
import { FaTimes } from 'react-icons/fa'
import Avatar from '../ui/Avatar'
import { BiCheck } from 'react-icons/bi'
import { useAssignMemberToTask, useUnassignMemberFromTask } from '@/hooks/useTasks'
import { useParams } from 'next/navigation'
import { socket } from '@/lib/socket'

type AddMemberModalProps = {
    taskId: string
    cardId: string
    onClose: () => void
    members: User[],
    membersInTask: User[]
}

function AddMemberModal({ taskId, cardId, onClose, members, membersInTask }: AddMemberModalProps) {
    const { id: boardId } = useParams();

    const assignMemberToTask = useAssignMemberToTask();
    const unassignMemberToTask = useUnassignMemberFromTask();


    const handleAssignMemberToTask = (mem: User) => {
        assignMemberToTask.mutate({
            id: taskId, member_id: mem.id, board_id: boardId as string, card_id: cardId
        }, {
            onSuccess: () => {
                onClose();
                alert("Member assigned successfully");
            },
            onError: () => {
            }
        })
    }

    const handleUnassignMemberFromTask = (mem: User) => {
        unassignMemberToTask.mutate({
            id: taskId, member_id: mem.id, board_id: boardId as string, card_id: cardId
        }, {
            onSuccess: () => {
                onClose();
                alert("Member unassigned successfully");
            }
        })
    }


    return (
        <div className='relative w-60 bg-gray-800 rounded-lg shadow-xl border border-gray-700 text-gray-200'>
            <button
                onClick={onClose}
                className="absolute cursor-pointer top-0 right-0 p-2 text-gray-400"
            >
                <FaTimes size={16} />
            </button>

            <div className='text-center px-4 py-3 border-b border-gray-700'>
                <span>Members</span>
            </div>

            <div className='flex flex-col p-2'>
                <span>Board Members</span>
                <div className='space-y-1 overflow-scroll max-h-[200px] mt-3'>

                    {members?.map((mem) => {
                        const isInTask = membersInTask.some(m => m.id === mem.id);

                        return (
                            <button
                                key={mem.id}
                                onClick={() => {
                                    if (isInTask) {
                                        handleUnassignMemberFromTask(mem)
                                    } else {
                                        handleAssignMemberToTask(mem)
                                    }
                                }}
                                className='flex items-center w-full p-1 gap-3 hover:bg-gray-600 cursor-pointer'>
                                <Avatar user={mem} />
                                <span>{mem.name}</span>

                                {isInTask && (
                                    <BiCheck size={24} className='text-green-500' />
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default AddMemberModal