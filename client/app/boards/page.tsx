'use client';

import NavSideWorkPlace from "../components/board/NavSideWorkPlace";
import { useCreateBoard, useGetBoardsByUser, useUpdateBoard } from "@/hooks/useBoards";
import { useState } from "react";
import Link from "next/link";
import { BsPlus } from "react-icons/bs";
import ModalNewBoard from "../components/board/ModalNewBoard";
import { useQueryClient } from "@tanstack/react-query";

export default function BoardsManagementPage() {
    const { data: boards, isLoading, isError, error } = useGetBoardsByUser();
    const queryClient = useQueryClient();
    const createBoard = useCreateBoard();

    const [openModal, setOpenModal] = useState(false);

    const handleCreateBoard = (name: string, description: string) => {
        createBoard.mutate({ name, description },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["boardsByUser"] });
                    alert("Board created successfully");
                    setOpenModal(false);
                },
                onError: () => {
                    alert("Failed to create board");
                }
            }
        );
    }

    { isError && <div>Error: {error?.message}</div> }

    return (
        <div className="flex min-h-screen w-full mt-10 px-10 gap-6">
            <NavSideWorkPlace />

            <main className="flex-1">
                <h3 className="text-xl mb-4">YOUR WORKPLACE</h3>
                <div className="flex flex-wrap gap-3">
                    {isLoading ? (<div>Loading...</div>) : (
                        <>
                            {boards?.map((board) => (
                                <Link
                                    href={`/boards/${board.id}`}
                                    key={board.id}
                                    className="relative h-[100px] min-w-[200px] bg-white shadow-sm border border-gray-200 p-5 hover:shadow-md cursor-pointer"
                                >
                                    <h3 className="font-bold text-lg">
                                        {board.name}
                                    </h3>
                                    <p className="text-gray-500 text-sm mt-1">
                                        {board.description || ""}
                                    </p>
                                </Link>
                            ))}

                            <div onClick={() => setOpenModal(true)} className="cursor-pointer h-[100px] px-5 flex items-center border shadow-sm border-gray-200 justify-center gap-2">
                                <BsPlus />
                                <span>Create new board</span>
                            </div>
                        </>
                    )}
                </div>
            </main>

            {openModal &&
                <ModalNewBoard
                    isOpen={openModal}
                    onClose={() => setOpenModal(false)}
                    onSubmit={handleCreateBoard}
                    isCreating={createBoard.isPending}
                />
            }
        </div>
    );
}