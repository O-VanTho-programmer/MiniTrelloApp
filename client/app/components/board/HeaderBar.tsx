'use client'

import { BiBell } from "react-icons/bi"

type HeaderBarProps = {

}

function HeaderBar({ }: HeaderBarProps) {

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    }

    return (
        <div className="min-h-[50px] text-white flex items-center justify-between px-4 py-2 bg-gray-700">
            <span>
                Logo
            </span>

            <div className="flex items-center gap-4">
                <button className="cursor-pointer">
                    <BiBell size={16} />
                </button>
                <div className="relative">
                    <img className="peer rounded-full w-[40px] h-[40px] object-cover cursor-pointer" src={""} />

                    <ul className="absolute right-0 bg-gray-700 hidden peer-hover:block hover:block rounded-sm p-1 min-w-[100px]">
                        <li onClick={handleLogout} className="cursor-pointer py-1 px-3 text-center">Logout</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default HeaderBar