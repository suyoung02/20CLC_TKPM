import db from "../utils/db.js";

export default {
    async findByEmail(email) {
        const list = await db("user").where("Gmail", email);
        if (list.length === 0) return null;
        return list[0];
    },

    async findAllUser(){
        return db("user").where("Type",1)
    },
     addUser(user){
        return db("user").insert(user);
    }
};