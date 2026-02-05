'use client';

import NavSideWorkPlace from "../components/board/NavSideWorkPlace";
import { useState } from "react";
import Link from "next/link";
import { BsPlus } from "react-icons/bs";
import ModalNewBoard from "../components/board/ModalNewBoard";
import { useCreateBoard, useGetAllBoards } from "@/hooks/useBoards";

export default function BoardsManagementPage() {
    const { data: boards, isLoading, isError, error } = useGetAllBoards();
    const createBoard = useCreateBoard();

    const [openModal, setOpenModal] = useState(false);

    const handleCreateBoard = (name: string, description: string) => {
        createBoard.mutate({ name, description },
            {
                onSuccess: () => {
                    alert("Board created successfully");
                }
            }
        );
    }


    return (
        <div className="bg-white min-h-screen w-full">
            <NavSideWorkPlace />

            <main>
                <h3 className="text-xl ">YOUR WORKPLACE</h3>
                <div className="flex flex-wrap">
                    {boards?.map((board) => (
                        <Link
                            href={`/boards/${board.id}`}
                            key={board.id}
                            className="block group relative h-[250px] bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md cursor-pointer"
                        >
                            <h3 className="font-bold text-lg text-gray-800">
                                {board.name}
                            </h3>
                            <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                                {board.description || ""}
                            </p>
                        </Link>
                    ))}

                    <div className="h-[250px] flex items-center justify-center gap-2">
                        <BsPlus />
                        <span>Create new board</span>
                    </div>
                </div>
            </main>

            {openModal &&
                <ModalNewBoard
                    isOpen={openModal}
                    onClose={() => setOpenModal(false)}
                    onSubmit={handleCreateBoard}
                />
            }
        </div>
    );
}