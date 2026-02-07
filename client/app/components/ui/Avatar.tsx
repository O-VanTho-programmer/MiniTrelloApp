import { User } from "@/types/User"

function Avatar({ user }: { user: User }) {
    return (
        <>
            {user.avatar_url ? (
                <img className="w-8 h-8 rounded-full" src={user.avatar_url} />
            ) : (
                <span className="text-xs font-bold text-gray-600">{user.name.charAt(0).toUpperCase()}</span>

            )}
        </>

    )
}

export default Avatar