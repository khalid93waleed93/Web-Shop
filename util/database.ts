import {Sequelize} from "sequelize";
const databaseUrl = process.env.DATABASE_URL || process.env.LOCAL_DATABASE_URL;

if (!databaseUrl) {
  throw new Error('No database connection string found in environment variables');
}

export const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
});
// export const sequelize = new Sequelize('nodejs-app','postgres','lammkopf', {dialect:'postgres',host:'localhost', port:5432})

import { Product } from "../models/product"
import { User } from "../models/user"
import { Request, Response, NextFunction } from "express";
import { Cart } from "../models/cart";
import { CartItem } from "../models/cart-item";
import { Order } from "../models/order";
import { OrderItem } from "../models/order-item";

export const createTablesAndRelations = (callback = () => {}) => {
    Product.belongsTo(User, {constraints:true, onDelete:'cascade'});
    User.hasMany(Product);
    User.hasOne(Cart);
    Cart.belongsTo(User);
    Cart.belongsToMany(Product, {through: CartItem});
    Product.belongsToMany(Cart, {through: CartItem});
    Order.belongsTo(User);
    User.hasMany(Order);
    Order.belongsToMany(Product, {through: OrderItem, as: 'products' });
    Product.belongsToMany(Order, {through: OrderItem, as: 'orders'});
    sequelize.sync()
    // sequelize.sync({force:true})
    .then((result) => {
        return User.findByPk(1);
    
    
    }).then((result) => {
        if(!result){
           return User.create({name:'Max' , email:'max@max.com'})
        }
        return result
    }).then(async (result:User) => {
        if((await result.getCart()) === null ){
            return result.createCart();
        }    
            return
        
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
