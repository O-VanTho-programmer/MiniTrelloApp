import React, { useEffect, useState } from 'react'
import { FaTimes } from 'react-icons/fa';
import Button from '../ui/Button/Button';

type Props = {
    isOpen: boolean
    onSubmit: (name: string, description: string) => void
    onClose: () => void
    title: string
}

function FormNewCard({
    isOpen,
    onSubmit,
    onClose,
    title,
}: Props) {

    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    if (!isOpen) return null;

    useEffect(() => {
        setName('');
        setDescription('');
    }, [isOpen])


    const handleAddList = () => {
        if (name.trim().length > 0) {
            onSubmit(name, description);
        } else {
            alert('Name is required')
        }
    }

    return (
        <div className="bg-gray-700 rounded-xl p-3 shadow-xl">
            <input
                autoFocus
                type="text"
                placeholder="Enter name"
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border-2 border-gray-500 text-white text-sm focus:outline-none mb-3 placeholder-gray-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <textarea
                placeholder="Enter description (optional)"
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border-2 border-gray-500 text-white text-sm focus:outline-none mb-3 placeholder-gray-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <div className="flex items-center gap-2">
                <Button
                    disabled={name.trim().length === 0}
                    onClick={handleAddList}
                    title={title}
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

export default FormNewCard