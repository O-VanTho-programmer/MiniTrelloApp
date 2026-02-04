class Board {
    constructor(id, name, description, owner_id, member_ids) {
        this.id = id;
        this.name = name;
        this.description = description || '';
        this.owner_id = owner_id;
        this.member_ids = member_ids || [];
        this.create_at = new Date().toISOString();
    }
}