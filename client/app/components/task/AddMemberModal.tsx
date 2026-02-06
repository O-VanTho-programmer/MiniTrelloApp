import { User } from '@/types/User'
import { FaTimes } from 'react-icons/fa'
import Avatar from '../ui/Avatar'
import { BiCheck } from 'react-icons/bi'

type AddMemberModalProps = {
    onClose: () => void
    members: User[],
    membersInTask: User[]
}

function AddMemberModal({ onClose, members, membersInTask }: AddMemberModalProps) {
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

                    {members?.map((mem) => (
                        <button
                            key={mem.id}
                            onClick={() => { }}
                            className='flex items-center w-full gap-3'>
                            <Avatar url={mem.avatar_url} />
                            <span>{mem.name}</span>

                            {membersInTask.some(m => m.id === mem.id) && (
                                <BiCheck size={16} />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AddMemberModal