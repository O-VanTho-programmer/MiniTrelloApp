function Avatar({ url }: { url: string }) {
    return (
        <img className="w-8 h-8 rounded-full" src={url} />
    )
}

export default Avatar