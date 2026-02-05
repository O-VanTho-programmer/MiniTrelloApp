import { Card } from "./Card"

export interface List {
    id: string,
    name: string,
    board_id: string,
    order_number: number,
    create_at: string
}

export interface ListWithCards extends List{
    cards?: Card[]
}