import React from 'react'
import { FaChartBar } from 'react-icons/fa'

type NavSideWorkPlaceProps = {}

function NavSideWorkPlace({ }: NavSideWorkPlaceProps) {
    return (
        <nav className='hidden md:block shrink-0'>
            <ul className='min-w-[288px] '>
                <li className='p-2 flex items-center gap-2 mb-1 bg-gray-600 text-white'>
                    <FaChartBar />
                    <span>Boards</span>
                </li>
                {/* <li className='p-2 flex items-center gap-2 mb-1'>
                    <FaChartBar />
                    <span>All Members</span>
                </li> */}
            </ul>
        </nav>
    )
}

export default NavSideWorkPlace