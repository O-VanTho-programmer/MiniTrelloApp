export interface Board {
    id: string;
    name: string;
    description?: string;
    ownerId: string;       
    memberIds: string[];   
    createdAt: string;
}

export interface BoardCreateDTO{
    name: string,
    description?: string;
}