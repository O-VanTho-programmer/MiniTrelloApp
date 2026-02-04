class User {
    constructor(id, name, email, avatarUrl, provider) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.avatarUrl = avatarUrl;
      this.provider = provider;
      this.create_at = new Date().toISOString();
    }
}