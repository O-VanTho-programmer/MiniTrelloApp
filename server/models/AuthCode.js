const { db } = require("../config/db");

class AuthCode {
    constructor(email, code, expired_date) {
        this.email = email;
        this.code = code;
        this.expired_time = expired_date;
    }

    static async create(email, code) {
        const dto = {
            email: email,
            code: code,
            expired_time: Date.now() + 15 * 60 * 1000
        }

        const newAuthCode = await db.collection("auth_codes").add(dto);
        return new AuthCode(email, code, dto.expired_time);
    }

    static async verify(email, code) {
        const authCode = await db.collection("auth_codes").where("email", "==", email).where("code", "==", code).orderBy("expired_time", "desc").limit(1).get();

        if (authCode.empty) {
            return false;
        }

        const expireTime = authCode.docs[0].data().expired_time;
        if (expireTime < Date.now()) {
            return false;
        }

        return true;
    }
}

module.exports = AuthCode;