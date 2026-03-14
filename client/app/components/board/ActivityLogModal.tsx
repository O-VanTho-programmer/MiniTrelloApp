import { ActivityLog } from "@/types/ActivityLog";
import { useGetLogsByBoardId } from "@/hooks/useActivityLog";
import { formatDistanceToNow } from "date-fns";
import { FaUserEdit, FaPlus, FaTrash, FaArrowsAlt, FaUserPlus, FaUserMinus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

interface ActivityLogModalProps {
    boardId: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function ActivityLogModal({ boardId, isOpen, onClose }: ActivityLogModalProps) {
    const { data: logs, isLoading } = useGetLogsByBoardId(boardId);

    if (!isOpen) return null;

    const getActionIcon = (action: string) => {
        switch (action) {
            case 'CREATE': return <FaPlus className="text-emerald-500" />;
            case 'UPDATE': return <FaUserEdit className="text-amber-500" />;
            case 'DELETE': return <FaTrash className="text-rose-500" />;
            case 'MOVE': return <FaArrowsAlt className="text-sky-500" />;
            case 'ASSIGN': return <FaUserPlus className="text-indigo-500" />;
            case 'UNASSIGN': return <FaUserMinus className="text-orange-500" />;
            default: return <FaUserEdit className="text-gray-500" />;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-opacity">
            <div 
                className={`w-full max-w-md h-full bg-white/95 backdrop-blur-3xl shadow-2xl border-l border-white/20 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}
            >
                <div className="flex items-center justify-between p-6 bg-linear-to-r from-pink-500/10 to-rose-400/10 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-pink-600 to-rose-500 tracking-tight">Activity Log</h2>
                        <p className="text-xs text-gray-400 font-medium mt-1">Real-time board history</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-rose-50 text-gray-400 hover:text-rose-500 transition-colors"
                    >
                        <IoClose size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-pink-200 scrollbar-track-transparent">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-40">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                        </div>
                    ) : !logs || logs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <FaArrowsAlt className="text-gray-300 text-xl" />
                            </div>
                            <p className="text-gray-500 font-medium">No recent activity</p>
                            <p className="text-sm text-gray-400 mt-1">Actions on this board will appear here</p>
                        </div>
                    ) : (
                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                            {logs.map((log: ActivityLog) => (
                                <div key={log.id} className="relative flex items-start gap-4 group">
                                    <div className="absolute left-0 mt-1 w-10 h-10 rounded-full bg-white border-2 border-pink-100 shadow-sm flex items-center justify-center z-10 transition-transform group-hover:scale-110 group-hover:border-pink-300">
                                        {getActionIcon(log.action)}
                                    </div>
                                    <div className="ml-14 flex-1 min-w-0 bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start gap-2 mb-1">
                                            <p className="font-semibold text-gray-800 text-sm leading-tight">
                                                {log.details}
                                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 tracking-wider">
                                                    {log.entity_type}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="flex items-center text-xs text-gray-400 mt-2">
                                            <span className="font-medium">{formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
