import { NextFunction, Response,Request } from "express";

export const get404 = (req:Request, res:Response, next:NextFunction) => {
    res.status(404).render('404',{pageTitle:'Page not found', path:req.url,
    isAuthenticated: req.session.isLoggedIn});
}
export const get500 = (req:Request, res:Response, next:NextFunction) => {
    res.status(500).render('500',{pageTitle:'Error', path:'/500',
    isAuthenticated: req.session.isLoggedIn});
}
