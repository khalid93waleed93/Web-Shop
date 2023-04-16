
import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import path from 'path';
import {rootDir} from './util/path';
import * as admin  from './routes/admin'
import * as shop  from './routes/shop'
import * as auth  from './routes/auth'
import { get404, get500 } from './controllers/error';
import fs from 'fs'
import { mongoConnect, setUser } from './util/database';
import session, {SessionData} from 'express-session';
import connectMongoDBSession from 'connect-mongodb-session';
import { IUser } from './models/user';
import dotenv from 'dotenv';
import { csrfSync } from 'csrf-sync';
import flash from 'connect-flash'
import { error } from 'console';
import http from 'http'

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
        user:  IUser,
        // csrfToken(a:boolean): string | undefined
      }     
    }
}

const app = express();

const { csrfSynchronisedProtection } = csrfSync({
    getTokenFromRequest: (req) => req.body._csrf,
});

app.set('view engine', 'ejs');
const MongoDBStore = connectMongoDBSession(session);
const store = new MongoDBStore({
    uri:process.env.MONGODB_URI!,
    collection:'sessions'
})

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

app.use((req: Request, res: Response, next: NextFunction) => {
    
    if (req.headers.accept && req.headers.accept.includes('image/*')) {
        
      res.status(404).sendFile(path.join(publicPath, 'images', 'default-image.jpg'));
    } else {
        console.log('not executed');
      next();
    }
  });
app.use(session({secret:'my secret', resave:false, saveUninitialized:false, store:store}))

app.use(csrfSynchronisedProtection);
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken!(true);
    // console.log(res.locals.csrfToken,'---');
    
    next();
});
app.use(flash())
  
app.use(setUser);
app.use('/admin',admin.router);
app.use(shop.router);
app.use(auth.router);
app.use('/500', get500)
app.use(get404)
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).render('500', {
      pageTitle: 'Error!',
      path: '/500',
      isAuthenticated: req.session.isLoggedIn,
    });
  });
mongoConnect(()=>{
    app.listen(3000, () => {
        console.log('Server is listening on port 3000');
    });
})

