import express, { Request,Response,NextFunction } from "express";
import path from 'path';
import { rootDir } from "../util/path";

const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
    console.log("middleware3");
    // console.log(__dirname);
    res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    // console.log(path.join(__dirname, '../views/shop.html'));
    
});

export default router