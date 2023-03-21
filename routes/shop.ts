import express, { Request,Response,NextFunction } from "express";
import * as shopController from "../controllers/shop";

const router = express.Router();

router.get("/", shopController.getIndex);
router.get("/products", shopController.getProducts);
// router.get("/products/", shopController.getProducts);
router.get("/products/:productId", shopController.getProduct);
router.get("/cart", shopController.getCart);
router.post('/cart', shopController.postCart)
router.get("/orders", shopController.getOrders);
router.get("/checkout", shopController.getCheckout);
router.post('/cart-delete-item',shopController.postCartDeleteItem)


export { router }