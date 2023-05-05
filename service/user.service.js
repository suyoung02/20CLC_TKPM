import db from "../utils/db.js";

export default {
    async findByEmail(email) {
        const list = await db("users").where("email", email);
        if (list.length === 0) return null;
        return list[0];
    },
};