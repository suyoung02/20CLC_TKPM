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
    },
     updatename(name, Gmail) {
        return db("user").where("Gmail", Gmail).update({ Name: name });
    },
     updatephone(phone, Gmail) {
        return db("user").where("Gmail", Gmail).update({ Phone: phone });
    },
     updateaddress(address, Gmail) {
        return db("user").where("Gmail", Gmail).update({ Address: address });
    },
    updateAll(gmail,user){
        return db("user").where("Gmail", gmail).update(user);
    },
    upadteBlock(Block, Gmail) {
        return db("user").where("Gmail", Gmail).update({ Block: Block });
    },
};