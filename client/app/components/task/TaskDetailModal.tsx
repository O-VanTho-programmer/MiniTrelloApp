import { FaTimes, FaGithub, FaUser, FaArchive, FaRegCreditCard, FaAlignLeft, FaUserPlus } from 'react-icons/fa';
import { BsEye, BsPlus } from 'react-icons/bs';
import Button from '../ui/Button/Button';
import { Task } from '@/types/Task';
import { useGetMembers } from '@/hooks/useBoards';
import { useParams } from 'next/navigation';
import Avatar from '../ui/Avatar';
import { useState } from 'react';
import AddMemberModal from './AddMemberModal';
import { useAttachFromGithub, useDeleteAttachment, useDeleteTask, useGetAssignedMemberFromTask, useGetAttachmentsByTaskId, useUpdateTask } from '@/hooks/useTasks';
import ListRepoModal from '../repository/ListRepoModal';
import { getRepositoryById } from '@/services/githubRepo';
import { socket } from '@/lib/socket';
import ListAttachmentsModal from '../repository/ListAttachmentsModal';
import AttachmentCard from '../repository/AttachmentCard';
import { Attachment } from '@/types/GithubRepo';

type TaskDetailModalProps = {
    task: Task
    cardName: string
    cardId: string
    isOpen: boolean;
    onClose: () => void;
};

export default function TaskDetailModal({ isOpen, cardName, cardId, task, onClose }: TaskDetailModalProps) {
    if (!isOpen) return null;

    const { id } = useParams(); //boardid
    const { data: membersInBoard, isLoading } = useGetMembers(id as string);
    const { data: membersWithTaskId } = useGetAssignedMemberFromTask(task.id, cardId, id as string);

    const [openMembersinBoard, setOpenMembersinBoard] = useState<boolean>(false);
    const [isOpenRepoModal, setIsOpenRepoModal] = useState<boolean>(false);
    const [selectedRepo, setSelectedRepo] = useState<any>(null);
    const [listAttachments, setListAttachments] = useState<any[]>([]);
    const [selectType, setSelectType] = useState<string>("");

    const handleSelectRepo = async (repo: any) => {
        const getRepoById = await getRepositoryById(repo.id);
        setSelectedRepo(getRepoById);
        setIsOpenRepoModal(false);
    }

    const handleOpenListAttachments = async (type: "branches" | "commits" | "issues" | "pulls") => {
        setListAttachments(selectedRepo[type]);
        setSelectType(type);
    }

    const deleteTask = useDeleteTask();

    const handleDeleteTask = () => {
        if (!confirm("Are you sure you want to delete this task?")) {
            return;
        }

        deleteTask.mutate({ id: task.id, board_id: id as string, card_id: cardId }, {
            onSuccess: () => {
                socket.emit("update_task", { boardId: id as string, cardId: cardId })
                alert('Task deleted successfully');
                onClose();
            },
            onError: () => {
                alert('Failed to delete task');
            }
        })
    }

    const { data: attachments } = useGetAttachmentsByTaskId(task.id, cardId, id as string);

    const attachFromGithub = useAttachFromGithub();
    const deleteAttachment = useDeleteAttachment();

    const handleAttachFromGithub = (item: any, type: string) => {
        attachFromGithub.mutate({
            board_id: id as string, card_id: cardId, task_id: task.id, payload: {
                type: type,
                title: item?.name || item?.title || item?.message,
                url: item?.url || ""
            }
        })
    }

    const handleDeleteAttachment = (attachment: Attachment) => {
        deleteAttachment.mutate({
            id: task.id, board_id: id as string, card_id: cardId, attachment_id: attachment.id
        }, {
            onSuccess: () => {
                alert('Attachment deleted successfully');
            }
        })
    }

    const [nameTask, setNameTask] = useState<string>(task.name);
    const [descriptionTask, setDescriptionTask] = useState<string>(task.description || "");

    const updateTask = useUpdateTask();

    const handleEditTask = (name: string, description: string) => {
        updateTask.mutate({
            id: task.id, name: name,
            description: description || "", status: task.status,
            card_id: task.card_id, board_id: id as string
        }, {
            onSuccess: () => {
                alert("Task updated successfully");
                socket.emit("update_task", { boardId: id as string, cardId: cardId })
            }
        })
    }

    return (
        <div
            className="modal"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="modal-content min-h-[500px] max-h-[650px]! overflow-y-scroll relative max-w-3xl! bg-gray-900!">
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
                            <input className='text-xl font-semibold text-gray-100 mb-1 placeholder-white' placeholder={nameTask} onChange={(e) => setNameTask(e.target.value)} />
                            <p className="text-sm text-gray-400">
                                in list {cardName}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                        {/* Left Col */}
                        <div className="md:col-span-3 space-y-8 flex flex-col">
                            <div className="flex flex-wrap gap-6">
                                {/*Members List */}
                                <div className="space-y-1.5">
                                    <h4 className="text-xs font-semibold text-gray-400 uppercase">Members</h4>
                                    <div className="flex items-center gap-2">
                                        {membersWithTaskId?.members?.map((mem, idx) => (
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
                                        value={descriptionTask || ""}
                                        onChange={(e) => setDescriptionTask(e.target.value)}
                                        className="w-full min-h-[120px] bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-gray-200 placeholder-gray-500 transition"
                                    ></textarea>
                                </div>
                            </div>

                            <Button
                                title='Save'
                                onClick={() => handleEditTask(nameTask, descriptionTask)}
                                style='bg-gray-800 hover:bg-gray-700 text-gray-300 border-2 border-gray-400 self-end! w-fit'
                                isSaving={updateTask.isPending}
                                disabled={updateTask.isPending || (!nameTask || nameTask === task.name) && descriptionTask === task.description}
                            />

                            <div>
                                {attachments && (
                                    <>
                                        <h3 className="text-lg font-semibold text-gray-200 mb-2">Attachments</h3>
                                        {attachments.map((attachment, idx) => (
                                            <AttachmentCard onDelete={() => handleDeleteAttachment(attachment)} key={idx} attachment={attachment} />
                                        ))}
                                    </>
                                )}
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
                                            membersInTask={membersWithTaskId?.members || []}
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
                                {selectedRepo && (
                                    <div className='flex flex-col mt-2 gap-1 relative'>
                                        {listAttachments.length > 0 && (
                                            <ListAttachmentsModal
                                                onSelect={(attachment: any, type: string) => handleAttachFromGithub(attachment, type)}
                                                type={selectType}
                                                items={listAttachments}
                                                isOpen={listAttachments.length > 0}
                                                onClose={() => setListAttachments([])}
                                            />
                                        )}
                                        <Button
                                            style='hover:bg-gray-800 text-gray-300 border-2 border-transparent hover:border-gray-400 px-2!'
                                            onClick={() => handleOpenListAttachments("branches")}
                                            title='Attach Branch'
                                        />
                                        <Button
                                            style='hover:bg-gray-800 text-gray-300 border-2 border-transparent hover:border-gray-400 px-2!'
                                            onClick={() => handleOpenListAttachments("commits")}
                                            title='Attach Commit'
                                        />
                                        <Button
                                            style='hover:bg-gray-800 text-gray-300 border-2 border-transparent hover:border-gray-400 px-2!'
                                            onClick={() => handleOpenListAttachments("issues")}
                                            title='Attach Issue'
                                        />
                                        <Button
                                            style='hover:bg-gray-800 text-gray-300 border-2 border-transparent hover:border-gray-400 px-2!'
                                            onClick={() => handleOpenListAttachments("pulls")}
                                            title='Attach PR'
                                        />
                                    </div>
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