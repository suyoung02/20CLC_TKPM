import express from "express";
import hbs_sections from "express-handlebars-sections";
import numeral from "numeral";
import { engine } from "express-handlebars";
import dateFormat from "handlebars-dateformat"

import accountRoute from "./routes/account.route.js";
import cartRoute from "./routes/cart.route.js"

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
        },
    })
);
app.set("view engine", "hbs");
app.set("views", "./views");
app.use("/public", express.static("public"));

app.get("/", function (req, res){
    res.render("home")
})
app.use("/account", accountRoute);
app.use("/cart", cartRoute);
const PORT = 3000;
app.listen(PORT, function () {
    console.log(`E-commerce application listening at http://localhost:${PORT}`);
});