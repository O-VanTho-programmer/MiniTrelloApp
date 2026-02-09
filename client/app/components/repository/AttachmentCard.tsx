import { Attachment } from "@/types/GithubRepo"
import Link from "next/link"
import { BsGithub } from "react-icons/bs"
import Button from "../ui/Button/Button"

type AttachmentCardProps = {
    attachment: Attachment
    onDelete: (attachment: Attachment) => void
}

function AttachmentCard({ attachment, onDelete }: AttachmentCardProps) {
    const handleDelete = () => {
        if (!confirm("Are you sure you want to delete this attachment?")) {
            return;
        }

        onDelete(attachment);
    }


    return (
        <div className="text-white my-1">
            <div className="flex gap-2 items-center justify-between">
                <div className="flex gap-2 items-center">
                    <BsGithub size={20} />
                    <span>Github {attachment?.type}</span>
                </div>

                <Button
                    style="bg-gray-800 hover:bg-gray-700 text-gray-300"
                    onClick={handleDelete}
                    title="Delete"
                />
            </div>

            <Link href={attachment?.url_attachment || "/auth"}>
                <p className="p-3 hover:bg-gray-700">{attachment?.title}</p>
            </Link>
        </div>
    )
}

export default AttachmentCard