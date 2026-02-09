export interface GithubRepo {
    id: number;
    name: string;
    fullName: string;
    htmlUrl: string;
    private: boolean;
}

export interface Attachment {
    id: string;
    taskId: string;
    type: string;
    url_attachment: string;
    title: string;
    create_at: string;
}