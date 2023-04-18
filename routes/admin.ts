
import express from "express";
import * as adminController from "../controllers/admin";
import path from 'path';
import { rootDir } from "../util/path";
import { isAuth } from "../middleware/is-auth";
import { body } from "express-validator";


const router =  express.Router();
router.get("/add-product", isAuth ,adminController.getAddProduct);
router.get("/products", isAuth ,adminController.getProducts);
router.get("/edit-product/:productId", isAuth ,adminController.getEditProduct);
router.post("/add-product",
    [
    body('title')
    .isString().isLength({min:3}).trim(),
    // body('imageUrl')
    // .isURL(),
    body('price', 'Price must be a positive decimal with two digits after the comma')
      .matches(/^\d+\.\d{2}$/)
      .customSanitizer(value => {
        return parseFloat(value).toFixed(2);
      })
      .isFloat({ min: 0 }),
    body('description')
    .isLength({min:5, max:100}).trim()
    ],
    isAuth,
    adminController.postAddProduct
);
router.post('/edit-product',
    [
    body('title')
    .isString().isLength({min:3}).trim(),
    // body('imageUrl')
    // .isURL(),
    body('price','Price must be a positive decimal with two digits after the comma')
    .matches(/^\d+\.\d{2}$/)
    .customSanitizer(value => {
        return parseFloat(value).toFixed(2);
      })
    .isFloat({ min: 0 }),
    body('description')
    .isLength({min:5, max:100}).trim()
    ],
    isAuth,
    adminController.postEditProduct
);
router.post('/delete-product', isAuth ,adminController.postDeleteProduct)


export {router};
