const { db } = require("../config/db");
class User {
  constructor(id, name, email, avatarUrl, provider) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.avatar_url = avatarUrl;
    this.provider = provider;
  }

  static async createOrUpdate(data) {
    await db.collection('users').doc(data.id).set(data, { merge: true });

    return new User(data.id, data.name, data.email, data.avatar_url, data.provider);
  }
}

module.exports = User;