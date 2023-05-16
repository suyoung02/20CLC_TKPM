import express from "express";
import hbs_sections from "express-handlebars-sections";
import { engine } from "express-handlebars";
import numeral from 'numeral'
import accountRoute from "./routes/account.route.js";
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
        // defaultLayout: 'main.hbs'
        extname: "hbs",
        defaultLayout: "main",
        helpers: {
            section: hbs_sections(),
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

app.get("/", function (req, res){
    res.render("home")
})
app.use("/account", accountRoute)
app.use("/admin", adminRoute)
app.use("/cart", cartRoute)
app.use("/product", productsUserRoute)
const PORT = 3000;
app.listen(PORT, function () {
    console.log(`E-commerce application listening at http://localhost:${PORT}`);
});