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
    await db.collection('users').doc(userData.id).set(userData, { merge: true });

    return new User(userData.id, userData.name, userData.email, userData.avatarUrl, userData.provider);
  }

}