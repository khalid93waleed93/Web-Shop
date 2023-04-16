import express from "express";
import {body, check} from 'express-validator'
import * as authController from "../controllers/auth";
import { User } from "../models/user";
import { normalize } from "path";

const router =  express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.get('/reset', authController.getReset);
router.get('/reset:token', authController.getUpdatePassword);

router.post(
    '/login',
    [
    body('email').isEmail().withMessage('please enter a valid email address').normalizeEmail(),
    body('password').isLength({min:8}).withMessage('password has to be valid').trim()
    ],
    authController.postLogin);

router.post(
    '/signup',
    [
    check('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom( async (value , {req}) => {
        // const regex = /^test|\.test$/;
        // if(regex.test(value)){
        //     throw new Error('this email addres is forbidden');
        // }
        // return true
        const user = await User.findByEmail(value)
            if(user){
                return Promise.reject('E-Mail does already exist')
            }
    })
    .normalizeEmail(),
    body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[^a-zA-Z0-9]/)
    .withMessage('Password must contain at least one special character')
    .trim(),
    body('confirmPassword')
    .trim()
    .custom((value, {req}) => {
        if (value !== req.body.password){
            throw new Error('Password does not match');
        } else {
           return true
        }
    })
    ],
    authController.postSignup
);

router.post('/logout', authController.postLogout);
router.post('/reset', authController.postReset);
router.post('/update-password',
    [
    body('NewPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[^a-zA-Z0-9]/)
    .withMessage('Password must contain at least one special character')
    .trim(),
    body('confirmNewPassword')
    .trim()
    .custom((value, {req}) => {
        if (value !== req.body.password){
            throw new Error('Password does not match');
        } else {
        return true
        }
    })
    ],
    authController.postUpdatePassword);

export {router};