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
    userOtp = {
        Name: req.body.Username,
        password: hash,
        Gmail: req.body.Gmail,
        Type: 1,
        Block: 1//user
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
    if (user.Block == 2){
        return res.render("vwAccount/login", {
            err_message: "This account is blocked. Thank you for visit",
        });
    }
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
        res.redirect("/admin/user");
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

router.get("/profile", async function (req, res) {
    if (req.session.authUser==null){
        res.redirect("/account/login");
    }
    else{
        const user_Gmail = req.session.authUser.Gmail;
        const user = await userService.findByEmail(user_Gmail);
        req.session.authUser = user;
        res.render("vwAccount/profile", {
            user: user,

        });
    }});
router.post("/profile", async function (req, res) {
    let user= req.session.authUser;
    let errormessage = "changes success !!!";
    if (req.body.Name != "") {
        req.session.authUser.Name=req.body.Name;
        await userService.updatename(req.body.Name,user.Gmail);
    }
    if (req.body.Number != "") {
        req.session.authUser.Phone=req.body.Number;
        await userService.updatephone(req.body.Number,user.Gmail);
    }
    if (req.body.Address != "") {
        req.session.authUser.Address=req.body.Address;
        await userService.updateaddress(req.body.Address,user.Gmail);
    }
    const ret = bcrypt.compareSync(req.body.oldpassword, user.Password);
    if (req.body.password != "") {
        if (req.body.password != req.body.passwordconfirm) {
            errormessage = "Please confirm correct password";
        }
        if(req.body.oldpassword==""){
            errormessage = "Please enter password";
        }
        if(ret===false){
            errormessage = "Incorrect password !!";
        }
        if(ret===true){
            if (req.body.password != req.body.passwordconfirm) {
            } else {
                const rawPassword = req.body.passwordconfirm;
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(rawPassword, salt);
                let usernew = {
                    Gmail :req.session.authUser.Gmail,
                    Password: hash,
                    Name:req.session.authUser.Name,
                    Address: req.session.authUser.Address,
                    Phone: req.session.authUser.Phone ,
                    Type: 1,
                };
                req.session.authUser = usernew;
                await userService.updateAll(user.Gmail, req.session.authUser);
            }
        }
    }
    if (req.body.oldpassword != "") {
        if(req.body.password  ==""){
            errormessage = "Please confirm password";
        }
        if(req.body.password != req.body.passwordconfirm) {
            errormessage = "Please confirm correct password";
        }
    }
    user=req.session.authUser;

    req.session.message=errormessage;
    return res.render("vwAccount/profile", {
        errormessage: errormessage,
        user:user
    });
});
export default router;