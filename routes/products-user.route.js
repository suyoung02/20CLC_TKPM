import express from "express";
import productsService from "../service/product.service.js";
import userService from"../service/user.service.js";
import * as bodyParser from "express";

const router = express.Router();

router.get("/", async function (req, res) {
  const curPage = parseInt(req.query.page || 1);
  const limit = 6;
  const offset = (curPage - 1) * limit;
  const total = await productsService.countAll();
  const nPages = Math.ceil(total / limit);
  const pageNumbers = [];
  for (let i = 1; i <= nPages; i++) {
    pageNumbers.push({
      value: i,
      isCurrent: i === +curPage,
      isCurPage:curPage,
      nPages,
    });
  }

  const list = await productsService.findPageAll(limit, offset);
  res.render("vwProduct/byCat", {
    courses: list,
    empty: list.length === 0,
    pageNumbers: pageNumbers,
  });
});

router.get("/byCat/:id", async function (req, res) {
  const catId = req.params.id || 0;

  for (let c of res.locals.lcCategories) {
    if (c.CatID === +catId) c.isActive = true;
  }

  const curPage = parseInt(req.query.page || 1);
  const limit = 2;
  const offset = (curPage - 1) * limit;
  const total = await productsService.countByCatId(catId);
  const nPages = Math.ceil(total / limit);
  const pageNumbers = [];
  for (let i = 1; i <= nPages; i++) {
    pageNumbers.push({
      value: i,
      isCurrent: i === +curPage,
      isCurPage:curPage,
      nPages,
    });
  }
  const list = await productsService.findPageByCatId(catId, limit, offset);
  console.log(list)

  res.render("vwProduct/byCat", {
    products: list,
    empty: list.length === 0,
    pageNumbers: pageNumbers,
  });
});

router.get('/search', async function (req, res){
  console.log(req.session.Array.Array);
const ret= req.session.Search.Search;
  if(ret!=""){
    const product = await productsService.searchByName(ret);
    const CourCount= await productsService.countsearch(ret);
    if (product === null) {
      return res.redirect('/');
    }
    const catId = req.params.id || 0;
    for (let c of res.locals.lcCategories) {
      if (c.CatID === +catId) c.isActive = true;
    }
    const curPage = parseInt(req.query.page || 1);
    const limit = 6;
    const offset = (curPage - 1) * limit;
    const temp = await productsService.counttotalsearch(ret);
    const total = temp[0].CourCount;
    const nPages = Math.ceil(total / limit);
    const pageNumbers = [];
    for (let i = 1; i <= nPages; i++) {
      pageNumbers.push({
        value: i,
        isCurrent: i === +curPage,
        isCurPage:curPage,
        nPages,
      });
    }
    let list = await productsService.findPageByNameCourses(ret, limit, offset);
    if(req.session.Array.Array=="Price"){
       list = await productsService.PriceArragerment(ret, limit, offset);
    }
    if(req.session.Array.Array=="Rating"){
       list = await productsService.RateArragerment(ret, limit, offset);
    }
    res.render('vwCourses/search', {
      product: list,
      CourCount:CourCount,
      empty: list.length === 0,
      pageNumbers: pageNumbers
    });}
  else{
    res.render('vwCourses/search');
  }
});

router.post('/search', async function (req, res) {
  let ret=req.body.Search;
  req.session.Array={"Array":""};
  if(typeof ret === "undefined"){
    req.session.Array.Array=req.body.Array;
  }
  console.log(ret);
 if(ret!=null){
   req.session.Search=req.body;
  const product = await productsService.searchByName(ret);
 const CourCount= await productsService.countsearch(ret);
  if (product === null) {
    return res.redirect('/');
  }
   const catId = req.params.id || 0;
   for (let c of res.locals.lcCategories) {
     if (c.CatID === +catId) c.isActive = true;
   }
   const curPage = parseInt(req.query.page || 1);
   const limit = 6;
   const offset = (curPage - 1) * limit;
   const temp = await productsService.counttotalsearch(ret);
   const total = temp[0].CourCount;
   const nPages = Math.ceil(total / limit);
   const pageNumbers = [];
   for (let i = 1; i <= nPages; i++) {
     pageNumbers.push({
       value: i,
       isCurrent: i === +curPage,
       isCurPage:curPage,
       nPages,
     });
   }
   const list = await productsService.findPageByNameCourses(ret, limit, offset);
  res.render('vwCourses/search', {
    product: list,
    CourCount:CourCount,
    empty: list.length === 0,
    pageNumbers: pageNumbers
  });
 }
 else{
   const product = await productsService.searchByName(req.session.Search.Search);
   const CourCount= await productsService.countsearch(req.session.Search.Search);
   const catId = req.params.id || 0;
   for (let c of res.locals.lcCategories) {
     if (c.CatID === +catId) c.isActive = true;
   }
   const curPage = parseInt(req.query.page || 1);
   const limit = 6;
   const offset = (curPage - 1) * limit;
   const temp = await productsService.counttotalsearch(req.session.Search.Search);
   const total = temp[0].CourCount;
   const nPages = Math.ceil(total / limit);
   const pageNumbers = [];
   for (let i = 1; i <= nPages; i++) {
     pageNumbers.push({
       value: i,
       isCurrent: i === +curPage,
       isCurPage:curPage,
       nPages,
     });
   }
   let list = await productsService.findPageByNameCourses(req.session.Search.Search, limit, offset);
   if(req.session.Array.Array=="Price"){
      list = await productsService.PriceArragerment(req.session.Search.Search, limit, offset);
     console.log(list);
   }
   if(req.session.Array.Array=="Rating"){
      list = await productsService.RateArragerment(req.session.Search.Search, limit, offset);
     console.log(list);
   }
   console.log(req.session.Array.Array);

   res.render('vwCourses/search', {
     product: list,
     CourCount:CourCount,
     empty: list.length === 0,
     pageNumbers: pageNumbers
   });
 }
});

router.get('/detail/:id', async function (req, res) {
  const proId = req.params.id || 0;
  //const user = req.session.authUser;
  const product = await productsService.findById(proId);
  const listMost=await productsService.findProMostViews(proId);
  //await productsService.increaseView(proId);
  //const chap=await productsService.chapter(proId);
  //const rating=await productsService.ratingCourses(proId);
  //const teacherId=product.TeacherID; 
  //const teacher=await userService.findById(teacherId);
  //const rev=await productsService.review(proId);
  let flag;
  let loveFlag;
//   if(user == null){

//   } else {
//    flag = await productsService.checkEnroll(proId,user.id);
//    let lisst = await userService.checkWishCourse(user.id,proId);
//    if(lisst.length === 0){
//      loveFlag = false;
//    } else {
//      loveFlag = true;
//    }
//   }
//   console.log(req.session.auth);
  
//   if (product === null) {

//     return res.redirect('/');
//   }

  res.render('vwProduct/detail', {
    product: product,
     listMost,
    // chap,
    // rating,
    // teacher,
    // rev,
    // flag,
    // loveFlag,
    
  });
});

router.post('/add', async function (req, res) {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  const formattedToday = yyyy + '-' + mm + '-' + dd;
 
  //const user = req.session.auth;
  let ret=null;
  let flag=true;
  let check=false;
  req.body.dob=formattedToday;
  // if(user){
  //  ret= await productsService.addEnroll(req.body);
  // res.render('vwCourses/add',{
  //   ret:ret,
  //   layout: false,
  // });

  // }else{
  //   res.redirect("/account/login");
  // }
  const product = await productsService.findById(req.body.ProID);
  const listMost=await productsService.findProMostViews(req.body.ProID);
  let info={
    User:req.session.authUser.Gmail,
    ProID:req.body.ProID,
    Stock:req.body.quant[0]

  }
  console.log(info)
  const add=await productsService.addCart(info);
  if(add==null){
    flag=false;
    check=true;
  }
  if(req.session.auth){
    res.render('vwProduct/detail', {
      product: product,
       listMost,
      // chap,
      // rating,
      // teacher,
      // rev,
       flag,
       check,
      // loveFlag,
      
    });
  }else{
    res.redirect("/account/login");
  }
  
});

router.post('/comment', async function (req, res) {

  console.log(req.body)
  const id = req.body.CourID;
  const c=await productsService.addFB(req.body);
  const rating=await productsService.ratingCourses(id);
  await productsService.patch({CourID: id ,score: rating.rate});
  return res.redirect('/courses/detail/' + req.body.CourID)
  


});

router.post('/detail/:id', async function (req, res) {
  const proId = req.params.id || 0;
  const product = await productsService.findById(proId);



  let wishlist = {
    StudentID :req.session.authUser.id,
    CourID :req.params.id
  };
  let studentcourses={
    CourID :req.params.id,
    StudentID :req.session.authUser.id,
  }

  if(typeof  req.body.like!=="undefined"){
    let check = await productsService.findwishcourses(req.body.like);
      if(check==""){
        await productsService.addwishcourses(wishlist);
      } else {
        await userService.deleteWish(req.session.authUser.id,req.params.id);
      }
  }

  if(typeof  req.body.buy!=="undefined"){
    let check = await productsService.findstudentcourses(req.body.buy);
    if(check==""){
      await productsService.addstudentcourses(studentcourses);
    }
  }


  if (product === null) {
    return res.redirect('/');
  }

  res.redirect("/courses/detail/" + proId)

});


export default router;