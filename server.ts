import dotenv from 'dotenv';
import { expand }from 'dotenv-expand';
const result = dotenv.config();
if (result.error) {
    console.error(result.error);
    process.exit(1);
  }
  expand(result)
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import {rootDir} from './util/path';
import * as admin  from './routes/admin'
import * as shop  from './routes/shop'
import { get404 } from './controllers/error';
import fs from 'fs'
import {  createTablesAndRelations,setUser } from './util/databaseSet';
import { User } from './models/user';
declare global {
    namespace Express {
      interface Request {
        user?: User;
      }
    }
}

async function init(){


const app = express();
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended:true }));
const publicPath: string = path.join(rootDir, 'public');
const checkStaticContent = (req: Request, res: Response, next: NextFunction): void => {
    fs.access(publicPath, (err) => {
        if (err) {
            console.error('Das Verzeichnis "public" wurde nicht gefunden.');
        }
    });
    next();
};

app.use(express.static(publicPath), checkStaticContent);
app.use(setUser)
app.use(shop.router);
app.use('/admin',admin.router);
app.use(get404)


createTablesAndRelations(()=>{
    app.listen(3000, () => {
        console.log('Server is listening on port 3000');
    });
})

}
init()
