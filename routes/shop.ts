import express, { Request,Response,NextFunction } from "express";
import path from 'path';
import { rootDir } from "../util/path";
import { products } from "./admin";

const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.render('shop', {prods: products, pageTitle: 'Shop', path:'/'});
});

export default router