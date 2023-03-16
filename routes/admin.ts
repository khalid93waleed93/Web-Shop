
import express, { Request,Response,NextFunction } from "express";
import path from 'path';
import { rootDir } from "../util/path";

const products: object[] = [];
const router =  express.Router();
router.get("/add-product", (req: Request, res: Response, next: NextFunction) => { 
    res.render('add-product',{pageTitle:'Add Product', path:'/admin/add-product'});
});

router.post("/add-product", (req: Request, res: Response, next: NextFunction) => {
    products.push({title: req.body.title});
    console.log(req.body);
    res.redirect('/');
});

export {router, products};
