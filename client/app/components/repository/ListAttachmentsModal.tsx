import { FaTimes } from "react-icons/fa"

type ListAttachmentsModalProps = {
    items: any[]
    isOpen: boolean
    onClose: () => void
    onSelect: (attachment: any, type: string) => void
    type: string
}

function ListAttachmentsModal({ items, isOpen, onClose, onSelect, type }: ListAttachmentsModalProps) {
    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0"
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
            ></div>
            <div className="absolute shadow rounded-sm bg-gray-700 min-w-3xs text-white right-0">
                <div className="flex justify-end p-2">
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 cursor-pointer"
                    >
                        <FaTimes size={16} />
                    </button>
                </div>
                {items?.map((item, idx) => (
                    <button onClick={() => onSelect(item, type)} key={idx} className="p-1 w-full text-start hover:bg-gray-600 cursor-pointer mb-1 max-h-96 overflow-y-scroll">
                        {item?.name || item?.title || item?.message}
                    </button>
                ))}
            </div>
        </>

    )
}

export default ListAttachmentsModal