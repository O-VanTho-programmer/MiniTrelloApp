class List {
    constructor(id, name, board_id, order_number) {
      this.id = id;
      this.name = name;
      this.board_id = board_id;
      this.order_number = order_number;
      this.create_at = new Date().toISOString();
    }
  }