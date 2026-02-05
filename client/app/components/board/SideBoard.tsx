import { FaChevronLeft, FaUserFriends } from "react-icons/fa";

const MEMBERS = [
    { id: 1, name: 'User 1', avatar: 'SD', color: 'bg-red-600' },
    { id: 2, name: 'User 2', avatar: 'SD', color: 'bg-orange-600' },
    { id: 3, name: 'User 3', avatar: 'SD', color: 'bg-yellow-600' },
    { id: 4, name: 'User 4', avatar: 'SD', color: 'bg-red-500' },
];

type SideBoardProps = {
    members: typeof MEMBERS;
}


export default function SideBoard({}: SideBoardProps) {
    return (
        <div className="w-72 bg-[#1e1e24] text-gray-300 flex flex-col h-full border-r border-gray-700">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-gray-100">
                    <span className="w-6 h-6 bg-pink-600 rounded text-xs flex items-center justify-center">T</span>
                    My board
                </div>
                <button className="text-gray-400 hover:text-white">
                    <FaChevronLeft size={12} />
                </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
                <div className="flex items-center gap-2 mb-4 text-sm font-medium text-gray-400">
                    <FaUserFriends />
                    <span>Members</span>
                </div>

                <div className="space-y-3">
                    {MEMBERS.map((mem) => (
                        <div key={mem.id} className="flex items-center gap-3 cursor-pointer hover:bg-white/10 p-2 rounded-lg transition">
                            <div className={`w-8 h-8 rounded-full ${mem.color} flex items-center justify-center text-white text-xs font-bold`}>
                                {mem.avatar}
                            </div>
                            <span className="text-sm font-medium text-gray-200">{mem.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-4 mt-auto">
                <div className="mb-3 text-xs text-gray-400 leading-relaxed">
                    You can't find and reopen closed boards if close the board.
                </div>
                <button className="w-full bg-[#f87171] hover:bg-[#ef4444] text-white py-2 px-4 rounded font-medium text-sm transition-colors shadow-lg">
                    Close Board
                </button>
            </div>
        </div>
    );
}