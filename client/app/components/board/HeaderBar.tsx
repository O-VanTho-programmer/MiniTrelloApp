import { BiBell } from "react-icons/bi"

type HeaderBarProps = {

}

function HeaderBar({ }: HeaderBarProps) {
    return (
        <div className="min-h-[50px] text-white flex items-center justify-between px-4 py-2 bg-gray-700">
            <span>
                Logo
            </span>

            <div className="flex items-center gap-4">
                <button  className="cursor-pointer">
                    <BiBell size={16} />
                </button>
                <img className="rounded-full w-[40px] h-[40px] object-cover" src={""} />
            </div>
        </div>
    )
}

export default HeaderBar