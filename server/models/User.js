const { db } = require("../config/db");
class User {
  constructor(id, name, email, avatarUrl, provider) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.avatar_url = avatarUrl || "";
    this.provider = provider || "email";
  }

  static async createOrUpdate(data) {
    await db.collection('users').doc(data.id).set(data, { merge: true });

    return new User(data.id, data.name, data.email, data.avatar_url, data.provider);
  }

  static async create(name, email) {
    const dto = {
      name,
      email,
      avatar_url: "",
      provider: "email"
    }

    const newUser = await db.collection("users").add(dto);

    return new User(newUser.id, name, email, "", "email");
  }

  static async getByIds(ids) {
    if (ids.length === 0) return;

    const users = await db.collection("users").where("id", "in", ids).get();

    return users.docs.map(user => {
      const data = user.data();
      return new User(user.id, data.name, data.email, data.avatar_url, data.provider);
    });
  }

  static async getByEmail(email) {
    const user = await db.collection("users").where("email", "==", email).get();

    return user.docs[0].data();
  }
}


module.exports = User;