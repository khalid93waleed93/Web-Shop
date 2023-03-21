
import express, { Request,Response,NextFunction } from "express";
import * as adminController from "../controllers/admin";
import path from 'path';
import { rootDir } from "../util/path";


const router =  express.Router();
router.get("/add-product", adminController.getAddProduct);
router.get("/products", adminController.getProducts);
router.get("/edit-product/:productId", adminController.getEditProduct);
router.post("/add-product", adminController.postAddProduct);
router.post('/edit-product', adminController.postEditProduct)
router.post('/delete-product', adminController.postDeleteProduct)


export {router};
