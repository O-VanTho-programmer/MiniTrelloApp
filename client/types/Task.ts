import { User } from "./User"

export interface Task {
    id: string,
    name: string,
    description?: string,
    status: string,
    card_id: string,
    order_number: number,
    owner_id: string,
    member_ids: string[],
    create_at: string
}


export interface TaskWithAssignedMember extends Task {
    members?: User[] | []
}