// import { error, log } from "console";
import { NextFunction, Request, Response } from "express";
import { Db, MongoClient, ObjectId } from "mongodb";
import { User } from "../models/user";

let _db:Db;
export const mongoConnect = (callback: () => void) => {
  MongoClient.connect('mongodb+srv://khalid93waleed:lammkopf@clusternodejs.8dgcznv.mongodb.net/shop?retryWrites=true&w=majority')
  .then(client => {
    console.log('Connected');
    _db = client.db();
    callback();
  })
  .catch(err =>{ 
    console.log(err);
    throw err;
  })
}
export const getDb = () => {
  if(_db){
    return _db
  }
  throw ' No db found'
}
export const setUser = (req:Request , res: Response, next:NextFunction) => {
  User.findById('64257cb9aba867d684c66422')
  .then(user => {
     
    if(user){
      // req.user = User.fromMongoDocument(user as UserDocument);
      req.user = new User(user.name, user.email, user.cart ,user._id.toString())
      
    }
    
    next();
  }).catch(err => console.log(err))}