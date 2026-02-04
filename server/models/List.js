const { db } = require("../config/db");

class List {
  constructor(id, name, board_id, order_number, create_at) {
    this.id = id;
    this.name = name;
    this.board_id = board_id;
    this.order_number = order_number;
    this.create_at = create_at
  }

  static async create(data) {
    const dto = {
      name: data.name,
      board_id: data.board_id,
      order_number: data.order_number,
      create_at: new Date().toISOString()
    }

    const list = await db.collection("lists").add(dto);
    return new List(list.id, dto.name, dto.board_id, dto.order_number, dto.create_at);
  }

  static async getByBoardId(board_id) {
    const lists = await db.collection("lists").where("board_id", "==", board_id).orderBy("order_number", "asc").get();
    const listArray = [];

    lists.forEach((list) => {
      const data = list.data();
      listArray.push(new List(list.id, data.name, data.board_id, data.order_number, data.create_at));
    });

    return listArray;
  }

  static async update(id, data) {
    await db.collection("lists").doc(id).update(data);
    return { id, ...data };
  }

  static async delete(id) {
    await db.collection("lists").doc(id).delete();
    return true;
  }
}