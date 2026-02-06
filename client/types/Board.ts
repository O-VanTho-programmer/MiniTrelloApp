export interface Board {
    id: string;
    name: string;
    description?: string;
    ownerId: string;       
    memberIds: string[];
    isActive: boolean | true;   
    createdAt: string;
}

export interface BoardCreateDTO{
    name: string,
    description?: string;
}