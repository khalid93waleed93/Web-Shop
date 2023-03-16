import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import {rootDir} from './util/path';
import * as admin  from './routes/admin'
import shopRouter from './routes/shop'
import fs from 'fs'


const app = express();
app.set('view engine', 'pug');

// app.use(bodyParser.urlencoded({ extended:true }));
app.use(express.urlencoded({ extended:true }));
const publicPath: string = path.join(rootDir, 'public');
const checkPublicDirMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    fs.access(publicPath, (err) => {
        if (err) {
            console.error('Das Verzeichnis "public" wurde nicht gefunden.');
        }
    });
    next();
};

app.use(express.static(publicPath), checkPublicDirMiddleware);
app.use(shopRouter);
app.use('/admin',admin.router);

app.use((req:Request, res:Response, next:NextFunction) => {
    res.status(404).render('404',{pageTitle:'Page not found'});
})

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
