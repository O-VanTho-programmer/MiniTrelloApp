import { User } from "@/types/User";
import { FaUserFriends } from "react-icons/fa";
import Avatar from "../ui/Avatar";

type SideBoardProps = {
    members: User[] | undefined;
    onCloseBoard: () => void;
}


export default function SideBoard({ members = [], onCloseBoard }: SideBoardProps) {
    return (
        <nav className="w-0 sm:w-52 md:w-72 transition-all bg-[#1e1e24] text-gray-300 flex flex-col h-screen border-r border-gray-700">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-gray-100">
                    <span className="w-6 h-6 bg-pink-600 rounded text-xs flex items-center justify-center">T</span>
                    My board
                </div>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
                <div className="flex items-center gap-2 mb-4 text-sm font-medium text-gray-400">
                    <FaUserFriends />
                    <span>Members</span>
                </div>

                <div className="space-y-3">
                    {members.map((mem) => (
                        <div key={mem.id} className="flex items-center gap-3 cursor-pointer hover:bg-white/10 p-2 rounded-lg transition">
                            <Avatar url={mem.avatar_url} />
                            <span className="text-sm font-medium text-gray-200">{mem.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-4 mt-auto">
                <p className="mb-3 text-base text-gray-400 leading-relaxed">
                    You can't find and reopen closed boards if close the board.
                </p>
                <button onClick={onCloseBoard} className="w-full bg-red-400 hover:bg-red-500 cursor-pointer text-white py-2 px-4 rounded font-medium text-sm shadow-lg">
                    Close Board
                </button>
            </div>
        </nav>
    );
}