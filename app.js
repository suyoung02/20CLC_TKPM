import express from "express";
import hbs_sections from "express-handlebars-sections";
import numeral from "numeral";
import { engine } from "express-handlebars";
import dateFormat from "handlebars-dateformat"

import productsUserService from "./routes/products-user.route.js";
import productsService from "./service/product.service.js";
import categoryService from "./service/category.service.js";
import accountRoute from "./routes/account.route.js";
import activate_locals from "./middlewares/locals.mdw.js";
import activate_session from "./middlewares/session.mdw.js";
import adminRoute from "./routes/admin.route.js";
import cartRoute from "./routes/cart.route.js";
import productsUserRoute from "./routes/products-user.route.js";
const app = express();
app.use(
    express.urlencoded({
        extended:true,
    })
);

app.engine(
    "hbs",
    engine({
        extname: "hbs",
        defaultLayout: "main",
        helpers: {
            section: hbs_sections(),
            dateFormat,
            format_number(val) {
              return numeral(val).format("0,0");
            },
            eq(arg1, arg2) {
                return +arg1 === +arg2;
            },
            minus(a, b) {
                return a - b;
            },
            add(a, b) {
                return a + b;
            },
            eqString(arg1, arg2) {
                if (arg1.localeCompare(arg2) === 0) {
                    return true;
                }
                return false;
            },
        },
    })
);
app.set("view engine", "hbs");
app.set("views", "./views");
app.use("/public", express.static("public"));
activate_session(app);
activate_locals(app);
app.get("/", async function (req, res) {
  const newest = await productsService.findNewestproduct();
  let pc = await productsService.findProductPC();
  let lap = await productsService.findProductLap();
  res.render("home", {
    newest: newest,
    pc: pc,
    lap: lap
  });
});
app.use(async function (req, res, next) {
  let obj = [];
  obj.parent = await categoryService.findCatParent();
  obj.child = await categoryService.findAllWithDetails();
  res.locals.lcCategories = await categoryService.findAllWithDetails();
  res.locals.lcCatParent = await categoryService.findCatParent();
  res.locals.lcCat = await categoryService.findNotCatParent();
  next();
});

app.get("/", function (req, res){
    res.render("home")
})
app.use("/account", accountRoute)
app.use("/admin", adminRoute)
app.use("/cart", cartRoute)
app.use("/product", productsUserRoute)
app.use("/products", productsUserService)
app.use("/account", accountRoute);
app.use("/cart", cartRoute);
const PORT = 3000;
app.listen(PORT, function () {
    console.log(`E-commerce application listening at http://localhost:${PORT}`);
});