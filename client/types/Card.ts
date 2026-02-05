import { Task } from "./Task"

export interface Card {
    id: string,
    name: string,
    description?: string,
    board_id: string,
    order_number: number,
    create_at: string
}

export interface CardWithTask extends Card{
    tasks?: Task[] | []
}