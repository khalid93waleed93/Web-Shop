
import express from "express";
import * as adminController from "../controllers/admin";
import path from 'path';
import { rootDir } from "../util/path";
import { isAuth } from "../middleware/is-auth";


const router =  express.Router();
router.get("/add-product", isAuth ,adminController.getAddProduct);
router.get("/products", isAuth ,adminController.getProducts);
router.get("/edit-product/:productId", isAuth ,adminController.getEditProduct);
router.post("/add-product", isAuth ,adminController.postAddProduct);
router.post('/edit-product', isAuth ,adminController.postEditProduct)
router.post('/delete-product', isAuth ,adminController.postDeleteProduct)


export {router};
