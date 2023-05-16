import express from "express";

import productService from "../service/product.service.js";

const router = express.Router();

router.get('/viewCart', async function (req, res){
    const userID = 1;// req.session.authUser.Gmail;
    const listPro = await productService.findAllProCart(userID);
    let productList = [];
    let total = 0;
    let listCatType = [];
    for (let i = 0; i < listPro.length; i++){
        let tempPro = await productService.findProIDinProduct(listPro[i].ProID);
        let tempCatName = await productService.findTypeofProduct(listPro[i].ProID);
        tempPro[0].catName = tempCatName[0].CatName;
        total = total + tempPro[0].Price;
        productList.push(tempPro[0]);
        listCatType.push(tempCatName);
    }
    res.render("vwCart/cart", {
        products: productList,
        total: total,
        lengthPro: listPro.length,
        empty: productList.length === 0
    });
})

router.post("/viewcart/del", async function(req, res){
    const id = req.query.id || 0;
    console.log(id)
    const affected_rows = await productService.del(id);
    res.redirect("/cart/viewCart");
});

router.post("/orderlist/detail", async function(req, res){
    const id = req.query.id || 0;
    console.log(id)
    const list = await productService.findProByOrderID(id);
    let productList = [];
    let total = 0;
    for(let i = 0; i < list.length; i++){
        let tempPro = await productService.findProIDinProduct(list[i].ProID);
        let tempCatName = await productService.findTypeofProduct(list[i].ProID);
        tempPro[0].catName = tempCatName[0].CatName;
        total = total + tempPro[0].Price;
        productList.push(tempPro[0]);
    }
    res.render("vwCart/orderdetail", {
        products: productList,
        total: total,
        lengthPro: list.length,
        empty: productList.length === 0
    });
})

router.get("/orderlist", async function(req, res){
    const userGmail = 1;// req.session.authUser.Gmail;
    const orderList = await productService.findAllOrder(userGmail);
    console.log(orderList[0].Dated);
    res.render("vwCart/orderlist", {
        orderLists: orderList,
        listLength: orderList.length,
    })
})

export default router;