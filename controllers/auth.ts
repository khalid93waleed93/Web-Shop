
import { NextFunction, Response, Request } from "express";
import { Product, IProduct } from "../models/product";
import { User, UserModel } from "../models/user";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { validationResult } from "express-validator";
const mailjetTransport = require("nodemailer-mailjet-transport");

const secretKey = "2888c71a59472469d5376954c3ae3b2d";
const apiKey = "1dc62fd4963108f98f96c2bb9cd91fca";

const transporter = nodemailer.createTransport(
    mailjetTransport({
        auth: {
        apiKey: apiKey,
        apiSecret: secretKey,
        },
    })
);

export const getLogin = (req: Request, res: Response, next: NextFunction) => {
    let message: string | undefined | string[] = req.flash("error");
    message = message.length > 0 ? message[0] : undefined;

    res.render("auth/login", {
        pageTitle: "login",
        path: "/login",
        isAuthenticated: req.session.isLoggedIn,
        errorMessage: message,
        oldInput:{
            email:'',
            password:''
        },
        validationErrors:[]
    });
};

export const getSignup = (req: Request, res: Response, next: NextFunction) => {
    const date = new Date(Date.now());
    console.log(date);

    let message: string | undefined | string[] = req.flash("error");
    message = message.length > 0 ? message[0] : undefined;
    res.render("auth/signup", {
        pageTitle: "Signup",
        path: "/signup",
        isAuthenticated: req.session.isLoggedIn,
        errorMessage: message,
        oldInput: { email: "",
        password: "",
        confirmPassword: "",
        },
        validationErrors:[]
    });
};
export const postLogin = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(422).render("auth/login", {
            pageTitle: "login",
            path: "/login",
            isAuthenticated: req.session.isLoggedIn,
            errorMessage: errors.array()[0].msg,
            oldInput:{
                email:req.body.email,
                password:req.body.password
            },
            validationErrors:errors.array()
        });
    }
    try {
        const user = await User.findByEmail(req.body.email);
        if (!user) {
            return res.status(422).render("auth/login", {
                pageTitle: "login",
                path: "/login",
                isAuthenticated: req.session.isLoggedIn,
                errorMessage: "Invalid E-Mail or password",
                oldInput:{
                    email:req.body.email,
                    password:req.body.password
                },
                validationErrors:[]
            });
        }
        
        const doMatch = await bcryptjs.compare(req.body.password, user.password);
        
        if (doMatch) {
            req.session.user = user;
            req.session.isLoggedIn = true;
            await req.session.save();
            res.redirect("/");
        } else {
            return res.status(422).render("auth/login", {
                pageTitle: "login",
                path: "/login",
                isAuthenticated: req.session.isLoggedIn,
                errorMessage: "Invalid E-Mail or password",
                oldInput:{
                    email:req.body.email,
                    password:req.body.password
                },
                validationErrors:[]
            });;
        }
    } catch (err) {
        console.log(err);
        res.redirect("/login");
    }
};
export const postLogout = (req: Request, res: Response, next: NextFunction) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
};
export const postSignup = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    // console.log(errors.array());
    
    const { email, password, confirmPassword } = req.body;
    
    if (!errors.isEmpty()) {
        return res.status(422).render("auth/signup", {
            pageTitle: "Signup",
            path: "/signup",
            isAuthenticated: req.session.isLoggedIn,
            errorMessage: errors.array()[0].msg,
            oldInput: {
            email,
            password,
            confirmPassword,
            },
            validationErrors: errors.array()
        });
    }
    
    const hashedPassword = await bcryptjs.hash(password, 12);
    const newUser = new User(hashedPassword, email, { items: [] });
    
    try {
        await newUser.save();
        res.redirect("/login");
        await sendMailNode(email, "Signup succeeded", "You successfully signed up");
    } catch (err) {
        next(err);
    }
};
export const getReset = (req: Request, res: Response, next: NextFunction) => {
    let message: string | undefined | string[] = req.flash("error");
    message = message.length > 0 ? message[0] : undefined;
    res.render("auth/reset", {
        pageTitle: "Reset Password",
        path: "/reset",
        isAuthenticated: req.session.isLoggedIn,
        errorMessage: message,
    });
};
export const postReset = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const buffer = await crypto.randomBytes(32);
        const token = buffer.toString("hex");
        const user = await User.findByEmail(req.body.email);
        if (!user) {
            req.flash("error", "no account found");
            return res.redirect("/reset");
        }
            
        user.resetToken = token;
        user.resetTokenExpiration = new Date(Date.now() + 3600000);
        await user.save();
            
        res.redirect("/");
        await sendMailNode(
            req.body.email,
            "Password reset",
            `<p>You requested a password reset</p>
                Click this <a href="http://localhost:3000/reset${token}">link</a> to set a new password`
        );
    } catch (err) {
        next(err);
    }
};
export const getUpdatePassword = async (req: Request, res: Response, next: NextFunction) => {
    let message: string | undefined | string[] = req.flash("error");
    message = message.length > 0 ? message[0] : undefined;
    const token = req.params.token;
    
    try {
        const user = await User.findByToken(token);
        if (user) {
            res.render("auth/update-password", {
                pageTitle:    "Update Password",
                path: "/reset",
                isAuthenticated: req.session.isLoggedIn,
                errorMessage: message,
                userId: user._id.toString(),
                token: token,
            });
        } else {
            req.flash("error", "Invalid token or token expired");
            res.redirect("/reset");
        }
    } catch (err) {
        next(err);
    }
};
export const postUpdatePassword = async (req: Request, res: Response, next: NextFunction) => {
    const newPassword = req.body.newPassword;
    const userId = req.body.userId;
    const token = req.body.token;
    
    try {
        const user = await User.findById(userId);
        if (
            user &&
            user.resetToken === token &&
            (user.resetTokenExpiration?.valueOf() ?? 0) > Date.now()
          ) {
            const hashedPassword = await bcryptjs.hash(newPassword, 12);
            user.password = hashedPassword;
            user.resetToken = undefined;
            user.resetTokenExpiration = undefined;
            await user.save();
          
            res.redirect("/login");
            await sendMailNode(user.email, "Password updated", "Your password has been updated");
        } else {
            req.flash("error", "Invalid token or token expired");
            res.redirect("/reset");
        }
    } catch (err) {
        next(err);
    }
};
async function sendMailNode(to: string, subject: string, html: string) {
    try {
        await transporter.sendMail({
            to,
            from:{
                name:'Khalid',
                address:'k.waleed@viscircle.com'
            },
            subject,
            html,
        });
    } catch (err) {
        console.log(err);
    }
}