
import express, { Request,Response,NextFunction } from "express";
import path from 'path';
import { rootDir } from "../util/path";

const products: object[] = [];
const router =  express.Router();
router.get("/add-product", (req: Request, res: Response, next: NextFunction) => {
    console.log("middleware2");
    res.sendFile(path.join(rootDir, 'views','add-product.html'));
    // console.log(path.join(__dirname, 'views/404.html'));
    // console.log(path.join(rootDir, 'views/404.html'));
});

router.post("/add-product", (req: Request, res: Response, next: NextFunction) => {
    products.push({title: req.body.title});
    console.log(req.body);
    res.redirect('/');
});

export {router, products};
