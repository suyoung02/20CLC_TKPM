import db from "../utils/db.js";

export default {
    async findAllOrder(){
        return db("order_list");
    },
    async findByProID(OrderID, ProID){
        return db("order_detail").where("ProID", ProID).where("OrderID", OrderID);
    }
};