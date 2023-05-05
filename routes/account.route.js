import express from "express";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

import userService from "../service/user.service.js";

const router = express.Router();

router.get("/register", async function (req, res) {
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
    const rawPassword = req.body.password;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(rawPassword, salt);
    console.log(req.session.auth);
    userOtp = {
        username: req.body.username,
        password: hash,
        email: req.body.email,
        permission: 1,//user
        blocked: false,
    };

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "youremail",
            pass: "yourapppassword",
        },
    });
    const string = userOtp.email;
    const mailOptions = {
        from: "tvqhuy20@clc.fitus.edu.vn",
        to: string,
        subject: "Your OTP to verify your account",
        text: otp,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });

    res.redirect("register/verify");
});

router.get("/login", function(req, res){
    res.render("vwAccount/login")
})
router.post("/login", async function (req, res) {
    const user = await userService.findByEmail(req.body.email);
    if (user === null) {
        return res.render("vwAccount/login", {
            err_message: "Invalid username or password.",
        });
    }

    const ret = bcrypt.compareSync(req.body.password, user.password);
    if (ret === false) {
        return res.render("vwAccount/login", {
            err_message: "Invalid username or password.",
        });
    }

    delete user.password;

    console.log(req.session.auth);
    if(user.blocked == true){
        return res.render("banned", {
        });
    }
    else {
        req.session.auth = true;
        req.session.authUser = user;
        if(req.session.authUser.permission == 2){
            res.redirect("/admin/users");
        }
        else if(req.session.authUser.permission == 1){
            res.redirect("/");
        }
    }

});

export default router;