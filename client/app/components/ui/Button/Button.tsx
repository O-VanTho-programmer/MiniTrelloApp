import { IconType } from "react-icons"


type ButtonProps = {
    icon?: IconType;
    iconSize?: number
    title: string
    onClick: () => void
    style?: string,
}

function Button({
    icon,
    iconSize = 16,
    title,
    onClick,
    style
}: ButtonProps) {

    const Icon = icon || null

    return (
        <button className={`${style || ''} cursor-pointer py-2 px-4 rounded-sm flex justify-between items-center gap-2`} onClick={onClick}>
            {Icon && <Icon size={iconSize} />}
            <span>{title}</span>
        </button>
    )
}

export default Button