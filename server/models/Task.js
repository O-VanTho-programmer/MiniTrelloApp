class Task {
    constructor(id, title, description, status, card_id, order_number, owner_id, member_ids) {
        this.id = id;
        this.title = title;
        this.description = description || '';
        this.status = status;
        this.card_id = card_id;
        this.order_number = order_number;
        this.owner_id = owner_id;
        this.member_ids = member_ids || [];
        this.create_at = new Date().toISOString();
    }
}