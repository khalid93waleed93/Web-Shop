import express, { Request,Response,NextFunction } from "express";
import path from 'path';
import { rootDir } from "../util/path";
import { products } from "./admin";

const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.render('shop', {prods: products, docTitle: 'Shop'});
    // res.render('shop');
    // console.log("middleware3");
    // console.log(products);
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    // console.log(path.join(__dirname, '../views/shop.html'));
    
});

export default router