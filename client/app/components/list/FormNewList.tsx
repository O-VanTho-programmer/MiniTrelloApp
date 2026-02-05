import React, { useState } from 'react'
import { FaTimes } from 'react-icons/fa';
import Button from '../ui/Button/Button';

type Props = {
    isOpen: boolean
    onSubmit: (name: string) => void
    onClose: () => void
}

function FormNewList({
    isOpen,
    onSubmit,
    onClose
}: Props) {

    const [nameList, setNameList] = useState<string>('');

    const handleAddList = () => {
        onSubmit(nameList);
    }

    return (
        <div className="bg-gray-700 rounded-xl p-3 shadow-xl">
            <input
                autoFocus
                type="text"
                placeholder="Enter list title..."
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border-2 border-gray-500 text-white text-sm focus:outline-none mb-3 placeholder-gray-500"
                value={nameList}
                onChange={(e) => setNameList(e.target.value)}
            />

            <div className="flex items-center gap-2">
                <Button
                    onClick={handleAddList}
                    title="Add list"
                    style="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm"
                />
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-100 p-2 rounded hover:bg-gray-700 cursor-pointer"
                >
                    <FaTimes size={16} />
                </button>
            </div>
        </div>
    )
}

export default FormNewList