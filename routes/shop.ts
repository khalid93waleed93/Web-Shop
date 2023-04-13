import express, { Request,Response,NextFunction } from "express";
import * as shopController from "../controllers/shop";
import { isAuth } from "../middleware/is-auth";

const router = express.Router();

router.get("/", shopController.getIndex);
router.get("/products", shopController.getProducts);
// router.get("/products/", shopController.getProducts);
router.get("/products/:productId", shopController.getProduct);
router.get("/cart",isAuth , shopController.getCart);
router.post('/cart',isAuth , shopController.postCart)
router.get("/orders",isAuth , shopController.getOrders);
router.get("/checkout",isAuth , shopController.getCheckout);
router.post('/cart-delete-item',isAuth ,shopController.postCartDeleteItem)
router.post('/create-order',isAuth , shopController.postOrder)

export { router }