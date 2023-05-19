import db from "../utils/db.js";

export default {
    async findAllSmallCate(){
        return db("category");
    },
  findAll() {
    return db("categories");
  },
  findNotCatParent() {
    return db("category");
  },
  async findCatParent() {
    // const sql = `	select b.*, count(p.CourID) as CourCount
    // from categories c, courses p, bigcategories b
    // where b.CatID = c.CatParent and c.CatID = p.CatID
    // group by b.CatID, b.CatName`;
    const sql = `select * from big_category`;
    const ret = await db.raw(sql);
    return ret[0];
  },

  async countCourForBig(id) {
    const sql = `	select b.*, count(p.CourID) as CourCount
    from categories c, courses p, bigcategories b
    where b.CatID = c.CatParent and c.CatID = p.CatID and b.CatID = ${id} group by b.CatID, b.CatName`;
    const ret = await db.raw(sql);
    return ret[0];
  },
  async findMostEnrollCat() {
    const sql = `SELECT ca.CatID, ca.CatName, COUNT(e.StudentID) as quantity
    FROM enroll e, courses c, categories ca
    WHERE e.CourID = c.CourID and c.CatID = ca.CatID and  e.dob > DATE_SUB(DATE(NOW()), INTERVAL DAYOFWEEK(NOW())+6 DAY) AND e.dob <= DATE_SUB(DATE(NOW()), INTERVAL DAYOFWEEK(NOW())-1 DAY)
    GROUP BY ca.CatName
    ORDER By quantity DESC
    LIMIT 5`;
    const ret = await db.raw(sql);
    return ret[0];
  },
  async findById(id) {
    const list = await db("categories").where("CatID", id);
    if (list.length === 0) return null;

    return list[0];
  },
  async findByGmail(Gmail) {
    const list = await db("user").where("Gmail", Gmail);
    if (list.length === 0) return null;

    return list[0];
  },
  async findByBigCatId(id) {
    const list = await db("BigCategories").where("CatID", id);
    if (list.length === 0) return null;

    return list[0];
  },

  async findAllWithDetails() {
    const sql = `	select c.*, count(p.ProID) as CourCount
    from category c
           left join product p on c.CatID = p.CatID
    group by c.CatID, c.CatName, c.BigCatID`;
    const ret = await db.raw(sql);
    return ret[0];
  },

  addBig(newBigCategory) {
    return db("BigCategories").insert(newBigCategory);
  },
  add(newCategory) {
    return db("categories").insert(newCategory);
  },

  del(id) {
    return db("categories").where("CatID", id).del();
  },
  delBig(id) {
    return db("BigCategories").where("CatID", id).del();
  },
  patch(category) {
    const id = category.CatID;
    delete category.CatID;

    return db("categories").where("CatID", id).update(category);
  },
  patchBig(BigCategories) {
    const id = BigCategories.CatID;
    delete BigCategories.CatID;

    return db("BigCategories").where("CatID", id).update(BigCategories);
  }
};