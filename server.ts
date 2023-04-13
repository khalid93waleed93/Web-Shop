
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import {rootDir} from './util/path';
import * as admin  from './routes/admin'
import * as shop  from './routes/shop'
import * as auth  from './routes/auth'
import { get404 } from './controllers/error';
import fs from 'fs'
import { mongoConnect, setUser } from './util/database';
import session, {SessionData} from 'express-session';
import connectMongoDBSession from 'connect-mongodb-session';
import { IUser } from './models/user';
import dotenv from 'dotenv';
import { csrfSync } from 'csrf-sync';
import flash from 'connect-flash'

dotenv.config();
declare module "express-session"{
    interface SessionData {
      isLoggedIn: boolean,
      user:  IUser
    }
}
declare global {
    namespace Express {
      interface Request {
        user:  IUser
      }     
    }
}

const { csrfSynchronisedProtection } = csrfSync({
    getTokenFromRequest: (req) => req.body._csrf,
  });
const app = express();


app.set('view engine', 'ejs');
const MongoDBStore = connectMongoDBSession(session);
const store = new MongoDBStore({
    uri:process.env.MONGODB_URI!,
    collection:'sessions'
})

app.use(express.urlencoded({ extended:false }));
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
app.use(session({secret:'my secret', resave:false, saveUninitialized:false, store:store}))
app.use(csrfSynchronisedProtection);
app.use(flash())
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken!(true);
    next();
  });
app.use(setUser);
app.use('/admin',admin.router);
app.use(shop.router);
app.use(auth.router);
app.use(get404)


mongoConnect(()=>{
    app.listen(3000, () => {
        console.log('Server is listening on port 3000');
    });
})

