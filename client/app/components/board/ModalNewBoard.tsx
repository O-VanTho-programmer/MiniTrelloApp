import React, { useState } from 'react'
import { FaX } from 'react-icons/fa6';
import Button from '../ui/Button/Button';

type ModalNewBoardProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string, description: string) => void;
}

function ModalNewBoard({ isOpen, onClose, onSubmit }: ModalNewBoardProps) {
    if (!isOpen) {
        return null;
    }

    const [nameBoard, setNameBoard] = useState("");
    const [descriptionBoard, setDescriptionBoard] = useState("");

    const handleSubmit = () => {
        onSubmit(nameBoard, descriptionBoard);
    }

    return (
        <div className='modal'>
            <div className='modal-content'>
                <h3 className='mb-5 text-lg'>Create new board</h3>

                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Board Name
                        </label>
                        <input
                            autoFocus
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="Enter board name"
                            value={nameBoard}
                            onChange={(e) => setNameBoard(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description (Optional)
                        </label>
                        <textarea
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="Type in description"
                            value={descriptionBoard}
                            onChange={(e) => setDescriptionBoard(e.target.value)}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 mt-6">
                        <Button
                            icon={FaX}
                            style='bg-gray-200 text-gray-600 hover:bg-gray-300'
                            onClick={onClose}
                            title="Cancel"
                        />
                        <Button
                            style='bg-blue-500 text-white hover:bg-blue-600'
                            onClick={handleSubmit}
                            title="Create Board"
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ModalNewBoard