import handlebarsDateformat from "handlebars-dateformat";
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

    changeState(id, changer){
        return db("order_list").where("OrderID", id).update(changer);
    },
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
    },
    findAll() {
      return db("product");
    },
    async countAll() {
      const list = await db("product").count({ amount: "ProID" });
      return list[0].amount;
    },
    async countByCatId(catId) {
      const list = await db("product")
        .where("CatID", catId)
        .count({ amount: "ProID" });
      return list[0].amount;
    },
    async countWish(id) {
      const list = await db("wishproduct")
          .where("StudentID", id)
          .count({ amount: "CourID" });
      return list[0].amount;
    },
    async countEnroll(id) {
      const list = await db("enroll")
          .where("StudentID", id)
          .count({ amount: "CourID" });
      return list[0].amount;
    },
    async countByCourId(Courid) {
      const ret = await db.raw(
          "select count(*) as CourCount from product as course, wishproduct as wishlist where course.CourID=wishlist.CourID");
      return ret[0];
    },
  
    async findByTeacherID(id){
      return db("product").where("TeacherID",id);
    },
  
    async findByTeacherIDAndByCat(CatID,id){
      return db("product").where("TeacherID",id).where("CatID",CatID);
    },
  
    async findById(id) {
      const list = await db("product").where("ProID", id);
      if (list.length === 0) return null;
  
      return list[0];
    },
    async findProMostViews(id)
    {
      const Id=await db('product').select('CatID').where('ProID',id);
      console.log(Id[0].CatID);
      
      const list=await db('product').where('CatID',+Id[0].CatID).whereNot('ProID',id).orderBy('Price').limit(5);
      console.log(list[0])
      if (list.length === 0) return null;
  
      return list;
    },
  
    findPageByCatId(catId, limit, offset) {
      return db("product").where("CatID", catId).limit(limit).offset(offset);
    },
    async findPageByNameproduct(name, limit, offset) {
      const ret = await db.raw("select  linhvuc.CatName , khoahoc.*  from categories as linhvuc, product as khoahoc where linhvuc.CatID=khoahoc.CatID and khoahoc.Block =0 and match(linhvuc.CatName,khoahoc.CourName) against(? IN BOOLEAN MODE ) LIMIT ?? OFFSET ??",
          [name,limit,offset]
      );
      return ret[0];
    },
    async PriceArragerment(name, limit, offset) {
      const ret = await db.raw("select  linhvuc.CatName , khoahoc.*  from categories as linhvuc, product as khoahoc where linhvuc.CatID=khoahoc.CatID and khoahoc.Block =0 and match(linhvuc.CatName,khoahoc.CourName) against(? IN BOOLEAN MODE ) ORDER BY  khoahoc.Price LIMIT ?? OFFSET ?? ",
          [name,limit,offset]
      );
      return ret[0];
    },
    async RateArragerment(name, limit, offset) {
      const ret = await db.raw("select  linhvuc.CatName , khoahoc.*  from categories as linhvuc, product as khoahoc where linhvuc.CatID=khoahoc.CatID and match(linhvuc.CatName,khoahoc.CourName) against(? IN BOOLEAN MODE ) ORDER BY  khoahoc.score DESC  LIMIT ?? OFFSET ??",
          [name,limit,offset]
      );
      return ret[0];
    },
    async findPageByStudentID(id, limit, offset) {
      const ret = await db.raw("select * from wishproduct as thamgia, product as khoahoc where thamgia.CourID=khoahoc.CourID and thamgia.StudentID like ?? LIMIT ?? OFFSET  ??",[id,limit,offset]
          );
      return ret[0];
    },
    async findPageByStudentIDforenroll(id, limit, offset) {
      const ret = await db.raw("select * from enroll as thamgia, product as khoahoc where thamgia.CourID=khoahoc.CourID and thamgia.StudentID like ?? LIMIT ?? OFFSET  ??",[id,limit,offset]
      );
      return ret[0];
    },
    findPageByCourID(catId, limit, offset) {
      return db("product").where("CourID", catId).limit(limit).offset(offset);
    },
    findPageAll(limit, offset) {
      return db("product").limit(limit).offset(offset);
    },
    findByCatId(catID) {
      return db("product").where("CatID", catID);
    },
  

    async findNewestproduct() {
      return db("product").orderBy("Price");
    },
  
    async findProductPC() {
      const sql = `SELECT pro.ProName,bc.BigCatName,bc.BigCatID,pro.Price,pro.ProID FROM product pro, category c,big_category bc
      where pro.CatID=c.CatID and c.BigCatID=bc.BigCatID and bc.BigCatID=1
      limit 5`;
      const ret = await db.raw(sql);
      return ret[0];
    },
    async findProductLap() {
      const sql = `SELECT pro.ProName,bc.BigCatName,bc.BigCatID,pro.Price,pro.ProID FROM product pro, category c,big_category bc
      where pro.CatID=c.CatID and c.BigCatID=bc.BigCatID and bc.BigCatID=2
      limit 5`;
      const ret = await db.raw(sql);
      return ret[0];
    },

  
  
    async increaseView(id) {
      const list = await db("product").where("CourID", id);
      return db("product")
        .where("CourID", id)
        .update({ Views: list[0].Views + 1 });
    },
  
  
    addNew(product) {
      return db("product").insert(product);
    },
    patch(product) {
      const id = product.CourID;
      delete product.CourID;
  
      return db("product").where("CourID", id).update(product);
    },
    addwishproduct(wishlist){
      return db("wishproduct").insert(wishlist);
    },
    async addEnroll(entity){
      console.log(entity);
      delete entity.FeedBack;
      delete entity.Rating;
      const check=await db('enroll').where('CourID',entity.CourID).where('StudentID',entity.StudentID);
      if(check.length===0)
      {
        return await db('enroll').insert(entity);
      }else{
      return null;}
    },
    async checkEnroll(Courid,id){
      
      const check=await db('enroll').where('CourID',Courid).where('StudentID',id);
      let flag = true;
      if(check.length===0)
      {
        flag = false    
      }
      return flag;
    },
    async addFB(entity)
    {
      const today = new Date();
      const yyyy = today.getFullYear();
      let mm = today.getMonth() + 1; // Months start at 0!
      let dd = today.getDate();
  
      if (dd < 10) dd = '0' + dd;
      if (mm < 10) mm = '0' + mm;
  
      const formattedToday = yyyy + '-' + mm + '-' + dd;
      entity.dob=formattedToday;
      return await db('productrating').insert(entity);
  
  
    },
    async findAllWithDetails() {
      const sql = `	select c.*, count(p.ProID) as CourCount
      from category c
             left join product p on c.CatID = p.CatID
      group by c.CatID, c.CatName, c.BigCatID`;
      const ret = await db.raw(sql);
      return ret[0];
    },
    async addCart(entity){
      const check=await db('cart').where('ProID',entity.ProID).where('User',entity.User);
      if(check.length===0)
      {
        return await db('cart').insert(entity);
      }else{
      return null;}
    }
  
};
