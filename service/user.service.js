import db from "../utils/db.js";

export default {
    async findByEmail(email) {
        const list = await db("user").where("Gmail", email);
        if (list.length === 0) return null;
        return list[0];
    },
     addUser(user){
        return db("user").insert(user);
    }
};