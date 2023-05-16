import db from "../utils/db.js";

export default {
    async findAllSmallCate(){
        return db("category");
    }
};