import express from "express";
import isLogin from "../middlewares/isLogin.mdw.js";
import productService from "../service/product.service.js";
import randomOrderID from "random-string-generator";
import userService from "../service/user.service.js";
const router = express.Router();
let priceTotal;
router.get('/viewCart', isLogin, async function (req, res){
    const userID = req.session.authUser.Gmail;
    const listPro = await productService.findAllProCart(userID);
    let productList = [];
    let total = 0;
    let listCatType = [];
    let number = 0;
    if(listPro != null){
        for (let i = 0; i < listPro.length; i++){
            let tempPro = await productService.findProIDinProduct(listPro[i].ProID);
            let tempCatName = await productService.findTypeofProduct(tempPro[0].CatID);
            tempPro[0].catName = tempCatName[0].CatName;
            tempPro[0].stockBuy = listPro[i].Stock;
            total = total + tempPro[0].Price * listPro[i].Stock;
            number = number + listPro[i].Stock
            // console.log(listPro[i])
            productList.push(tempPro[0]);
            listCatType.push(tempCatName);
        }
    }
    priceTotal = total;
    res.render("vwCart/cart", {
        products: productList,
        total: total,
        lengthPro: number,
        empty: productList.length === 0
    });
})

router.post("/viewcart/del", async function(req, res){
    const id = req.query.id || 0;
    const affected_rows = await productService.del(id, req.session.authUser.Gmail);
    res.redirect("/cart/viewCart");
});

router.post("/viewcart/down", async function(req, res){
    const id = req.query.id || 0;
    const affected_rows = await productService.down(id, req.session.authUser.Gmail);
    res.redirect("/cart/viewCart");
});

router.post("/viewcart/up", async function(req, res){
    const id = req.query.id || 0;
    const affected_rows = await productService.up(id, req.session.authUser.Gmail);
    res.redirect("/cart/viewCart");
});

router.post("/orderlist/detail", isLogin, async function(req, res){
    const id = req.query.id || 0;
    const list = await productService.findProByOrderID(id);
    let productList = [];
    let total = 0;
    for(let i = 0; i < list.length; i++){
        let tempPro = await productService.findProIDinProduct(list[i].ProID);
        let tempCatName = await productService.findTypeofProduct(tempPro[0].CatID);
        tempPro[0].catName = tempCatName[0].CatName;
        tempPro[0].sk = list[i].Stock;
        total = total + tempPro[0].Price * list[i].Stock;
        productList.push(tempPro[0]);
    }
    res.render("vwCart/orderdetail", {
        products: productList,
        total: total,
        lengthPro: list.length,
        empty: productList.length === 0
    });
})

router.get("/orderlist", isLogin, async function(req, res){
    const userGmail = req.session.authUser.Gmail;
    const orderList = await productService.findAllOrder(userGmail);

    res.render("vwCart/orderlist", {
        orderLists: orderList,
        listLength: orderList.length,
    })
});

router.get("/viewCart/payment", isLogin, async function(req, res){
    res.render("vwCart/payment.hbs",{
        price: priceTotal,
    })
});
router.post("/viewCart/payment", isLogin, async function(req, res, next){
    let orderID = randomOrderID(10);
    while (productService.checkDupOrderID(orderID) === true){
        orderID = randomOrderID(10);
        console.log(1)
    }
    const order = {
        OrderID: orderID,
        Gmail: req.session.authUser.Gmail,
        Dated: new Date(),
        State: 1,
        Payment: "Ship COD",
        phone: req.body.phone,
        address: req.body.address,
        TotalPrice: priceTotal,
    };
    await productService.addOrder(order);
    await productService.addItemToDetail(req.session.authUser.Gmail, orderID);
    await productService.delItem(req.session.authUser.Gmail);
    res.redirect('/cart/orderlist')
})

export default router;