import db from "../utils/db.js";

export default {
    async findAllOrder(){
        return db("order_list");
    }
};