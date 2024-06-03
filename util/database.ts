// import { error, log } from "console";
import { NextFunction, Request, Response } from "express";
import { Db, MongoClient, ObjectId } from "mongodb";
import { User } from "../models/user";
import mongoose from "mongoose";
import { error } from "console";
import { mongoDB_URL } from "./path";
export const mongoConnect = (callback: () => void) => {
  
  mongoose.connect(mongoDB_URL!)
  .then(client => {
    console.log('Connected to DB');
    // User.findOne().then( u => {
    //   if(!u){
    //     const user = new User('khalid93waleed','k.waleed@viscircle.com',{items:[]});
    //     user.save();
    //   }
    // })
    callback();
  })
  .catch((err:Error) =>{ 
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
  }).catch(err =>{
    next(err);
  } )
    
}