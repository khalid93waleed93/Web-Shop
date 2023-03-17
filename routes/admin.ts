
import express, { Request,Response,NextFunction } from "express";
import { getAddProduct, postAddProduct } from "../controllers/products";
import path from 'path';
import { rootDir } from "../util/path";


const router =  express.Router();
router.get("/add-product", getAddProduct);

router.post("/add-product", postAddProduct);

export {router};
