export interface Card{
    id: string,
    name: string,
    description?: string,
    list_id: string,
    board_id: string,
    order_number: number,
    owner_id: string,
    member_ids: string[],
    create_at: string
}