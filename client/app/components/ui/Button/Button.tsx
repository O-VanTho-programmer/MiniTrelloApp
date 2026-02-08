import { IconType } from "react-icons"
import { FaSpinner } from "react-icons/fa";


type ButtonProps = {
    icon?: IconType;
    iconSize?: number
    title: string
    onClick: () => void
    style?: string,
    disabled?: boolean,
    isSaving?: boolean,
}

function Button({
    icon,
    iconSize = 16,
    title,
    onClick,
    style,
    disabled = false,
    isSaving
}: ButtonProps) {

    const Icon = icon || null

    return (
        <button disabled={disabled} type="button" className={`${style || ''} disabled:bg-gray-500 disabled:text-gray-700 cursor-pointer py-2 px-4 rounded-sm flex justify-between items-center gap-2`} onClick={onClick}>

            {isSaving ? (
                <FaSpinner size={iconSize} className="animate-spin" />
            ) : (
                <>{Icon && <Icon size={iconSize} />}</>
            )}

            <span>{isSaving ? 'Saving...' : title}</span>

        </button>
    )
}

export default Button