import { useGetRepositories } from '@/hooks/useGithubRepo';
import { FaGithub, FaGlobe, FaLock, FaTimes } from 'react-icons/fa';

type ListRepoModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSelectRepo: (repo: any) => void;
}

function ListRepoModal({ isOpen, onClose, onSelectRepo, }: ListRepoModalProps) {
    if (!isOpen) return null;

    const { data: repositories = [], isLoading, isError } = useGetRepositories();

    const handleSelectRepo = (repo: any) => {
        onSelectRepo(repo);
        onClose();
    }

    return (
        <div className="modal absolute!">
            <div className="modal-content max-h-[500px] ">

                <div className="flex items-center justify-between px-3 py-4">
                    <div className="flex items-center gap-2 text-gray-800">
                        <FaGithub size={20} />
                        <h3 className="text-lg font-bold">Select a Repository</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 cursor-pointer"
                    >
                        <FaTimes size={16} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-scroll p-2 max-h-[400px]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-40 text-gray-500 gap-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
                            <span className="text-sm">Fetching repositories from GitHub...</span>
                        </div>
                    ) : isError ? (
                        <div className="p-8 text-center text-red-500">
                            Failed to load repositories. Please check your GitHub connection.
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {repositories?.map((repo) => (
                                <button
                                    key={repo.id}
                                    onClick={() => handleSelectRepo(repo)}
                                    className="w-full text-left flex items-center overflow-hidden gap-2 p-3 hover:bg-white hover:shadow-md border border-transparent hover:border-gray-200 rounded-lg transition-all group cursor-pointer"
                                >
                                    <div className={`mt-1 p-2 rounded-full ${repo.private ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                                        {repo.private ? <FaLock size={14} /> : <FaGlobe size={14} />}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <span className="font-semibold text-gray-800 group-hover:text-blue-600 transition truncate">
                                            {repo.fullName}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ListRepoModal