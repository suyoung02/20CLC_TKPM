import express from "express";
import hbs_sections from "express-handlebars-sections";
import { engine } from "express-handlebars";

import accountRoute from "./routes/account.route.js";
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
const PORT = 3000;
app.listen(PORT, function () {
    console.log(`E-commerce application listening at http://localhost:${PORT}`);
});