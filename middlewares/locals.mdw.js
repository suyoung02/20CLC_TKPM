import productsService from '../service/product.service.js';
import categoryService from "../service/category.service.js";


export default function (app) {
    app.use(async function (req, res, next) {
        if (typeof req.session.auth === 'undefined') {
            req.session.auth = false;
        }
        let listPro;
        if(req.session.auth){
            listPro = await productsService.findTotalProInCart(req.session.authUser.Gmail);
        }
        else{
            listPro = 0;
        }
        res.locals.numberPro = listPro;
        res.locals.auth = req.session.auth;
        res.locals.authUser = req.session.authUser;
        res.locals.lcCatParent = await categoryService.findCatParent();
        res.locals.lcCat = await categoryService.findNotCatParent();
        next();
    });

    app.use(async function (req, res, next) {
        res.locals.lcCategories = await productsService.findAllWithDetails();
        next();
    });
}