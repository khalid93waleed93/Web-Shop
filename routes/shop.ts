import express, { Request,Response,NextFunction } from "express";
import { getShop } from "../controllers/products";

const router = express.Router();

router.get("/", getShop);

export { router }