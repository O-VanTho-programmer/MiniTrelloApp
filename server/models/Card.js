const { db } = require("../config/db");

class Card {
  constructor(id, name, description, board_id, order_number, create_at) {
    this.id = id;
    this.name = name;
    this.description = description || '';
    this.board_id = board_id;
    this.order_number = order_number;
    this.create_at = create_at;
  }

  static async create(data) {
    const dto = {
      name: data.name,
      description: data.description || '',
      board_id: data.board_id,
      order_number: data.order_number || 0,
      create_at: new Date().toISOString()
    }

    const card = await db.collection("cards").add(dto);
    return new Card(card.id, dto.name, dto.description, dto.board_id, dto.order_number, dto.create_at);
  }

  static async getById(id) {
    const card = await db.collection("cards").doc(id).get();

    if (!card.exists) {
      throw new Error("Card not found");
    }

    const data = card.data();

    return new Card(id, data.name, data.description, data.board_id, data.order_number, data.create_at)
  }

  static async getByBoardId(board_id) {
    const cards = await db.collection("cards").where("board_id", "==", board_id).orderBy("order_number", "asc").get();

    return cards.docs.map((card) => {
      const data = card.data();
      return new Card(card.id, data.name, data.description, data.board_id, data.order_number, data.create_at);
    })
  }

  static async getByUserId(userId) {
    const cards = await db.collection('cards').where('member_ids', 'array-contains', userId).get();

    const res = await Promise.all(cards.docs.map(async card => {
      const data = card.data();
      const countTask = await this.getCountTask(card.id);

      return {
        id: card.id,
        name: data.name,
        description: data.description,
        board_id: data.board_id,
        order_number: data.order_number,
        owner_id: data.owner_id,
        member_ids: data.member_ids,
        create_at: data.create_at,
        countTask: countTask
      }
    }));

    return res;
  }

  static async update(id, data) {
    await db.collection("cards").doc(id).update(data);
    return { id, ...data };
  }

  static async delete(id) {
    await db.collection("cards").doc(id).delete();
    return true;
  }

  static async getCountTask(cardId) {
    const tasks = await db.collection('tasks').where('card_id', '==', cardId).get();
    return tasks.size;
  }
}

module.exports = Card;