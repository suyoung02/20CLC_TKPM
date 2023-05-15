import db from "../utils/db.js";
export default {
    findAllProCart(gmail){
        const list = db("cart").select("ProID").where("Gmail", gmail);//ten dang nhap la gmail
        if (list.length === 0) return null;
        return list;
    },
    findProIDinProduct(proID){
        const list = db("product").where("ProID", proID)
        if (list.length === 0) return null;
        return list;
    },
    findTypeofProduct(catID){
        const list = db("category").select("CatName").where("CatID", catID);
        if (list.length === 0) return null;
        return list;
    },
    findAllOrder(gmail){
        const list = db("order_list").select("* ").where("Gmail", gmail)
        if (list.length === 0) return null;
        return list;
    },
    findProByOrderID(orderID){
        const list = db("order_detail").select("ProID").where("OrderID", orderID);
        if(list.length === 0) return null;
        return list;
    },
    del(proID){
        return db("cart").where("ProID", proID).del()
    }
}