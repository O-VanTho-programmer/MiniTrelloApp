class Card {
    constructor(id, name, description, list_id, board_id, order_number, owner_id, member_ids) {
        this.id = id;
        this.name = name;
        this.description = description || '';
        this.list_id = list_id;
        this.board_id = board_id;
        this.order_number = order_number;
        this.owner_id = owner_id;
        this.member_ids = member_ids || [];
        this.create_at = new Date().toISOString();
    }
}