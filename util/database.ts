import {Sequelize} from "sequelize";
export const sequelize = new Sequelize('nodejs-app','postgres','lammkopf', {dialect:'postgres',host:'localhost', port:5432})

import { Product } from "../models/product"
import { User } from "../models/user"
import { Request, Response, NextFunction } from "express";
import { Cart } from "../models/cart";
import { CartItem } from "../models/cart-item";

export const createTablesAndRelations = (callback = () => {}) => {
    Product.belongsTo(User, {constraints:true, onDelete:'cascade'});
    User.hasMany(Product);
    User.hasOne(Cart);
    Cart.belongsTo(User);
    Cart.belongsToMany(Product, {through: CartItem});
    Product.belongsToMany(Cart, {through: CartItem});
    sequelize.sync()
    .then((result) => {
        return User.findByPk(1);
    
    
    }).then((result) => {
        if(!result){
           return User.create({name:'Max' , email:'max@max.com'})
        }
        return result
    }).then((result:User) => {
        return result.createCart();
    }).
    then(callback)
    .catch(err => console.log(err))

}
export const setUser = (req:Request , res:Response, next:NextFunction) => {
    User.findByPk(1).then((result)=>{
        req.user = result! 
        next()
    }).catch(err => console.log(err))
}
