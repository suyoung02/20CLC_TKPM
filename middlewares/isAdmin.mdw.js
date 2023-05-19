export default function (req, res, next){
    if(req.session.auth){
        if(req.session.authUser.Type == 2){
            next();
        }
        else{
            res.redirect("/");
        }
    }
    else{
        res.redirect("/account/login");
    }
}