class User {
  constructor(id, name, email, avatarUrl, provider) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.avatarUrl = avatarUrl;
    this.provider = provider;
    this.create_at = new Date().toISOString();
  }

  static async createOrUpdate(data) {
    await db.collection('users').doc(data.id).set(data, { merge: true });

    return new User(data.id, data.name, data.email, data.avatarUrl, data.provider);
  }

}