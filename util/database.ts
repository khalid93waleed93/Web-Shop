// import { error, log } from "console";
import { NextFunction, Request, Response } from "express";
import { Db, MongoClient, ObjectId } from "mongodb";
import { User } from "../models/user";
import mongoose from "mongoose";
import { error } from "console";

export const mongoConnect = (callback: () => void) => {
  mongoose.connect(process.env.MONGODB_URI!)
  .then(client => {
    console.log('Connected');
    // User.findOne().then( u => {
    //   if(!u){
    //     const user = new User('khalid93waleed','k.waleed@viscircle.com',{items:[]});
    //     user.save();
    //   }
    // })
    callback();
  })
  .catch((err:Error) =>{ 
    console.log(err.message);
    throw err;
  })
}

export const setUser = (req:Request , res: Response, next:NextFunction) => {
  // throw new Error('dumm')
  if(!req.session.user){
    return next();
  }
  User.findById(req.session.user._id)
  .then(user => {
    // throw new Error('dummy')
    if(user){
      req.user = user 
    }
    next();
  }).catch(err => next(err))
}