import db from "../utils/db.js";

export default {
    async getNextID() {
        const sql1 = "ANALYZE TABLE product";
        await db.raw(sql1);
        const sql = `SELECT AUTO_INCREMENT
                     FROM information_schema.TABLES
                     WHERE TABLE_SCHEMA = "tkpm"
                     AND TABLE_NAME = "product";`
        const ret = await db.raw(sql);
        return ret[0];
    },

    async findAllProduct(){
        return db("product");
    },
    async findByID(id){
        return db("product").where("ProID", id);
    },

    add(newProduct) {
        return db("product").insert(newProduct);
    },

    patch(product){
        return db("product").where("ProID", product.ProID).update(product);
    },

    del(id) {
        return db("product").where("ProID", id).del();
    },

    changeState(id, changer){
        return db("order_list").where("OrderID", id).update(changer);
    }
};