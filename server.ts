import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import {rootDir} from './util/path';
import * as admin  from './routes/admin'
import shopRouter from './routes/shop'


const app = express();
app.set('view engine', 'pug');

// app.use(bodyParser.urlencoded({ extended:true }));
app.use(express.urlencoded({ extended:true }));
app.use(express.static(rootDir +'/testing/public'))
app.use(shopRouter);
app.use('/admin',admin.router);

app.use((req:Request, res:Response, next:NextFunction) => {
    res.status(404).sendFile(path.join(rootDir, 'views/404.html'));
    
})

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
