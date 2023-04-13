// import { error, log } from "console";
import { NextFunction, Request, Response } from "express";
import { Db, MongoClient, ObjectId } from "mongodb";
import { User } from "../models/user";
import mongoose from "mongoose";

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
  .catch(err =>{ 
    console.log(err);
    throw err;
  })
}
// export const getDb = () => {
//   if(_db){
//     return _db
//   }
//   throw ' No db found'
// }
export const setUser = (req:Request , res: Response, next:NextFunction) => {
  if(!req.session.user){
    return next();
  }
  User.findById(req.session.user._id)
  .then(user => {
    if(user){
      req.user = user 
    }
    next();
  }).catch(err => console.log(err))}