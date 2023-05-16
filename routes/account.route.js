import express from "express";
import bcrypt from "bcryptjs";

import userService from "../service/user.service.js";

const router = express.Router();

router.get("/register",  function (req, res) {
    res.render("vwAccount/register");
});
function generateOTP() {
    const digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}
let otp = generateOTP();

let userOtp;
router.post("/register", async function (req, res) {
    const rawPassword = req.body.Password;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(rawPassword, salt);
    console.log(hash)
    userOtp = {
        Name: req.body.Username,
        password: hash,
        Gmail: req.body.Gmail,
        Type: 1,//user
        // blocked: false,
    };

    // const transporter = nodemailer.createTransport({
    //     service: "gmail",
    //     auth: {
    //         user: "youremail",
    //         pass: "yourapppassword",
    //     },
    // });
    // const string = userOtp.email;
    // const mailOptions = {
    //     from: "tvqhuy20@clc.fitus.edu.vn",
    //     to: string,
    //     subject: "Your OTP to verify your account",
    //     text: otp,
    // };
    //
    // transporter.sendMail(mailOptions, function (error, info) {
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         console.log("Email sent: " + info.response);
    //     }
    // });
    //
    // res.redirect("register/verify");
    await userService.addUser(userOtp);
    res.redirect('/account/login');

});
router.get("/is-available", async function (req, res) {
    const email = req.query.email;
    const user = await userService.findByEmail(email);
    if (user === null) {
        return res.json(true);
    }
    res.json(false);
});

router.get("/login", function(req, res){
    res.render("vwAccount/login")
})
router.post("/login", async function (req, res) {
    const user = await userService.findByEmail(req.body.Gmail);
    if (user === null) {
        return res.render("vwAccount/login", {
            err_message: "Invalid username or password.",
        });
    }
    const ret = bcrypt.compareSync(req.body.Password, user.Password);
    if (ret === false) {
        return res.render("vwAccount/login", {
            err_message: "Invalid username or password.",
        });
    }
    delete user.password;
    req.session.auth = true;
    req.session.authUser = user;
    if(req.session.authUser.Type == 2){
        res.redirect("/admin/users");
    }
    else if(req.session.authUser.Type == 1){
        const url = req.session.retUrl || "/";
        res.redirect(url);
    }
});
router.post("/logout", async function (req, res) {
    req.session.auth = false;
    req.session.authUser = null;

    const url = req.headers.referer || "/";
    res.redirect(url);
});


export default router;