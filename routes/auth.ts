import express from "express";
import {body, check} from 'express-validator'
import * as authController from "../controllers/auth";

const router =  express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.get('/reset', authController.getReset);
router.get('/reset:token', authController.getUpdatePassword);

router.post('/login', authController.postLogin);

router.post(
    '/signup',
    [
    check('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom((value , {req}) => {
        const regex = /^test|\.test$/;
        if(regex.test(value)){
            throw new Error('this email addres is forbidden');
        }
        return true
    }),
    body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[^a-zA-Z0-9]/)
    .withMessage('Password must contain at least one special character'),
    body('confirmPassword')
    .custom((value, {req}) => {
        if (value !== req.body.confirmPassword){
            throw new Error('Password does not match');
        }
    })
    ],
    authController.postSignup
);

router.post('/logout', authController.postLogout);
router.post('/reset', authController.postReset);
router.post('/update-password', authController.postUpdatePassword);

export {router};