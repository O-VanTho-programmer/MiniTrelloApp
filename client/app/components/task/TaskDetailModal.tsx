import { FaTimes, FaGithub, FaUser, FaArchive, FaRegCreditCard, FaAlignLeft, FaUserPlus } from 'react-icons/fa';
import { BsEye, BsPlus } from 'react-icons/bs';
import Button from '../ui/Button/Button';
import { Task } from '@/types/Task';
import { useGetMembers } from '@/hooks/useBoards';
import { useParams } from 'next/navigation';
import Avatar from '../ui/Avatar';
import { useMemo, useState } from 'react';
import AddMemberModal from './AddMemberModal';
import { useGetAssignedMemberFromTask } from '@/hooks/useTasks';
import ListRepoModal from '../repository/ListRepoModal';
import { getRepositoryById } from '@/services/githubRepo';

type TaskDetailModalProps = {
    task: Task
    cardName: string
    cardId: string
    isOpen: boolean;
    onDelete: (taskId: string) => void;
    onClose: () => void;
};

export default function TaskDetailModal({ isOpen, cardName, cardId, task, onDelete, onClose }: TaskDetailModalProps) {
    if (!isOpen) return null;

    const { id } = useParams(); //boardid
    const { data: membersInBoard, isLoading } = useGetMembers(id as string);
    const { data: membersWithTaskId } = useGetAssignedMemberFromTask(task.id, cardId, id as string);

    const members = useMemo(() => {
        if (!membersWithTaskId) return [];

        return membersWithTaskId.members;
    }, [membersWithTaskId])

    const [openMembersinBoard, setOpenMembersinBoard] = useState<boolean>(false);
    const [isOpenRepoModal, setIsOpenRepoModal] = useState<boolean>(false);

    const handleDeleteTask = () => {
        onDelete(task.id);
        onClose();
    }

    const handleSelectRepo = async (repo: any) => {
        
        const getRepoById = await getRepositoryById(repo.id);
        
        console.log(getRepoById);
    }

    return (
        <div
            className="modal"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="modal-content min-h-[500px] md:min-h-[650px]! relative max-w-3xl! bg-gray-900!">
                <button
                    onClick={onClose}
                    className="absolute cursor-pointer top-6 right-6 p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition"
                >
                    <FaTimes size={20} />
                </button>

                <div className="px-6 py-2 space-y-8">

                    <div className="flex gap-4">
                        <div className="pt-1 text-gray-400"><FaRegCreditCard size={20} /></div>
                        <div className="w-full">
                            <h2 className="text-xl font-semibold text-gray-100 mb-1">{task.name}</h2>
                            <p className="text-sm text-gray-400">
                                in list {cardName}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                        {/* Left Col */}
                        <div className="md:col-span-3 space-y-8">

                            <div className="flex flex-wrap gap-6">
                                {/*Members List */}
                                <div className="space-y-1.5">
                                    <h4 className="text-xs font-semibold text-gray-400 uppercase">Members</h4>
                                    <div className="flex items-center gap-2">
                                        {members?.map((mem, idx) => (
                                            <Avatar key={idx} user={mem} />
                                        ))}
                                        <button className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-300 transition cursor-pointer">
                                            <BsPlus size={12} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <h4 className="text-xs font-semibold text-gray-400 uppercase">Notifications</h4>
                                    <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-sm text-gray-300 border-2 border-gray-400 transition cursor-pointer">
                                        <BsEye />
                                        <span>Watch</span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="pt-1 text-gray-400"><FaAlignLeft size={20} /></div>
                                <div className="w-full space-y-3">
                                    <h3 className="text-lg font-semibold text-gray-200">Description</h3>
                                    <textarea
                                        placeholder="Add a more detailed description..."
                                        className="w-full min-h-[120px] bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-gray-200 placeholder-gray-500 transition"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="pt-1 text-gray-400"><FaAlignLeft size={20} /></div>
                                <div className="w-full space-y-3">
                                    <div className='flex justify-between'>
                                        <h3 className="text-lg font-semibold text-gray-200">Activity</h3>
                                        <Button
                                            onClick={() => { }}
                                            style="justify-start bg-gray-800 hover:bg-gray-700 text-gray-300 border-2 border-gray-400"
                                            title="Show details"
                                        />
                                    </div>
                                    <div>
                                        <textarea
                                            placeholder="Write a comment"
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-gray-200 placeholder-gray-500 transition"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Col */}

                        <div className="md:col-span-1 space-y-6">
                            <div className="space-y-2">
                                <span className="text-sm font-semibold text-gray-500">Add to card</span>
                                <Button
                                    onClick={() => setOpenMembersinBoard(true)}
                                    style="justify-start bg-gray-800 hover:bg-gray-700 text-gray-300 border-2 border-gray-400"
                                    icon={FaUser}
                                    title="Members"
                                />
                                {openMembersinBoard && (
                                    <div className='absolute'>
                                        <AddMemberModal
                                            taskId={task.id}
                                            cardId={cardId}
                                            members={membersInBoard || []}
                                            membersInTask={members || []}
                                            onClose={() => setOpenMembersinBoard(false)}
                                        />
                                    </div>
                                )}
                            </div>

                            <div>
                                <span className="text-sm font-normal text-gray-500">Power-Ups</span>
                                <Button
                                    onClick={() => setIsOpenRepoModal(true)}
                                    style="justify-start bg-gray-800 hover:bg-gray-700 text-gray-300"
                                    icon={FaGithub}
                                    title="GitHub"
                                />

                                {isOpenRepoModal && (
                                    <ListRepoModal
                                        isOpen={isOpenRepoModal}
                                        onClose={() => setIsOpenRepoModal(false)}
                                        onSelectRepo={handleSelectRepo}
                                    />
                                )}
                            </div>

                            <Button
                                style="justify-start bg-gray-800 hover:bg-red-900/50 hover:text-red-400 text-gray-300 border-2 border-gray-400"
                                icon={FaArchive} title="Archive" onClick={handleDeleteTask}
                            />

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}