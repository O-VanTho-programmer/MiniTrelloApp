export interface Task{
    id: string,
    title: string,
    description?: string,
    status: string,
    card_id: string,
    order_number: number,
    owner_id: string,
    member_ids: string[],
    create_at: string
}