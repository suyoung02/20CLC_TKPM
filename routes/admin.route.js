import router from "./account.route.js";
import isAdmin from "../middlewares/isAdmin.mdw.js";
import userService from "../service/user.service.js";
import productService from "../service/product.service.js";
import categoryService from "../service/category.service.js";
import orderService from "../service/order.service.js";
import multer from 'multer';
import fs from 'fs'

router.get("/product", isAdmin, async function (req, res) {
    const list = await productService.findAllProduct();
    res.render("vwAdmin/listProduct", {
        layout: "admin.hbs",
        product: list
    });
});

router.get("/product/detail", isAdmin, async function (req, res) {
    const id = req.query.id || 0;

    const list = await productService.findByID(id);
    res.render("vwAdmin/productDetail", {
        layout: "admin.hbs",
        product: list[0]
    });
});

router.get("/product/add",isAdmin, async function (req, res) {
    const list = await categoryService.findAllSmallCate()
    console.log(list[0])
    res.render("vwAdmin/addProduct", {
        layout: "admin.hbs",
        categories: list
    });
});

router.get("/BigCategories", isAdmin,function (req, res) {
    res.render("vwAdmin/admin_Big", {
        layout: "admin.hbs",
    });
});

router.get("/user", isAdmin,async function (req, res) {
    const list = await userService.findAllUser();
    res.render("vwAdmin/admin_User", {
        layout: "admin.hbs",
        users: list,
        empty: 0
    });
});

router.get("/product/edit",isAdmin, async function (req, res) {
    const id = req.query.id || 0;
    const courses = await productService.findByID(id);
    const cate = await categoryService.findAllSmallCate();
    if (courses === null) {
        return res.redirect('/teacher/courses');
    }
    res.render('vwAdmin/editProduct', {
        categories: cate,
        product: courses[0],
        layout: 'admin'
    });
});

router.get("/order", isAdmin,async function (req, res) {
    const id = req.query.id || 0;
    const list = await orderService.findAllOrder();
    res.render('vwAdmin/listOrder', {
        order: list,
        layout: 'admin'
    });
});

router.get("/order/detail", isAdmin,async function (req, res) {
    const id = req.query.id || 0;
    const list = await productService.findProByOrderID(id);
    let productList = [];
    let total = 0;
    for(let i = 0; i < list.length; i++){
        let tempPro = await productService.findProIDinProduct(list[i].ProID);
        let tempCatName = await productService.findTypeofProduct(list[i].ProID);
        let detail = await orderService.findByProID(id,list[i].ProID);
        tempPro[0].catName = tempCatName[0].CatName;
        tempPro[0].Stock = detail[0].Stock;
        total = total + tempPro[0].Price * detail[0].Stock;
        tempPro[0].Price = tempPro[0].Price * detail[0].Stock;
        productList.push(tempPro[0]);
    }
    res.render("vwAdmin/detailOrder", {
        products: productList,
        total: total,
        lengthPro: list.length,
        empty: productList.length === 0,
        layout: 'admin'
    });
});

router.post("/product/add", isAdmin,async function (req, res) {
    const next = await productService.getNextID();
    console.log(next)
    const nextID = next[0].AUTO_INCREMENT;
    let dir = './public/img/' + nextID;    //name of the directory/folder

    if (!fs.existsSync(dir)){    //check if folder already exists
        fs.mkdirSync(dir);    //creating folder
    }
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './public/img/' + nextID);
        },
        filename: function (req, file, cb) {
            cb(null, "main.jpg");
        }
    });
    const upload = multer({ storage: storage });
    upload.array('fuMain', 5)(req, res, async function (err) {
        let product = req.body;
        product.ProID = nextID;
        await productService.add(product);
        if (err) {
            console.error(err);
        } else {
            res.redirect("/admin/product");
        }
    })
});

router.post("/product/edit",isAdmin, async function (req, res) {
    const id = req.query.id || 0;
    let dir = './public/img/' + id;    //name of the directory/folder
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './public/img/' + id);
        },
        filename: function (req, file, cb) {
            cb(null,"main.jpg");
        }
    });
    const upload = multer({ storage: storage });
    upload.array('fuMain', 5)(req, res, async function (err) {
        let product = req.body;
        product.ProID = id;
        console.log(product)
        await productService.patch(product);
        if (err) {
            console.error(err);
        } else {
            res.redirect("/admin/product/detail?id=" + id);
        }
    })
});

router.post("/product/delete", isAdmin,async function (req, res) {
    const id = req.query.id || 0;
    console.log(id)
    await productService.delData(id);
    let dir = "./public/img/" + id + "/main.jpg";
    if(fs.existsSync(dir)) fs.unlinkSync(dir);
    res.redirect("/admin/product");
});
router.post("/order/cancel",isAdmin, async function (req, res) {
    const id = req.query.id || 0;
    let changer = {State: 4}
    await productService.changeState(id, changer);
    res.redirect("/admin/order");
});

router.post("/order/arriving", isAdmin,async function (req, res) {
    const id = req.query.id || 0;
    let changer = {State: 2}
    await productService.changeState(id, changer);
    res.redirect("/admin/order");
});

router.post("/order/success", isAdmin, async function (req, res) {
    const id = req.query.id || 0;
    let changer = {State: 3}
    await productService.changeState(id, changer);
    res.redirect("/admin/order");
});
export default router;