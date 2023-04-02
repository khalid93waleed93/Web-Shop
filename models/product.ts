import { ObjectId } from "mongodb";
import { getDb } from "../util/database";

interface IProduct {
    _id?: ObjectId;
    // userId:number;
    title: string;
    price: number;
    imageUrl: string;
    description: string;
    userId?:ObjectId
  }
export class Product implements IProduct {
  title: string;
  price: number;
  imageUrl: string;
  description: string;
  _id?: ObjectId;
  userId?: ObjectId
  constructor(title: string, price: number, description: string, imageUrl: string, userId?:ObjectId, id?:ObjectId){
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    // if(id){this._id = new ObjectId(id);}
    this._id = id ? id : undefined; 
    this.userId = userId ? userId : undefined ; 
    
  }
  save (){
    const db = getDb();
    let dbOp;
    if(this._id){
      dbOp = db.collection('products').updateOne({_id: this._id}, {$set: this});
    } else {
      dbOp = db.collection('products').insertOne(this);
    }
    return dbOp.then(result => {
      console.log(result); 
    })
    .catch( err => {
      console.log(err);
    });
  }
  static fetchAll(){
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .then(result => {
        console.log('fetch all',result);
         return result;
      })
      .catch(err => {
        console.log(err)
      })
  }
  static findById(id:string){
    const db = getDb();
    return db
      .collection('products')
      // .find({_id: new ObjectId(id)})
      // .next()
      .findOne({_id: new ObjectId(id)})
      .then(result => {
        console.log('find id',result);
         return result;
      })
      .catch(err => {
        console.log(err)
      })
  }
  static async deleteById(id: string) {
    const db = getDb();
    await db
    .collection("users")
    .updateMany(
      { "cart.items.productId": new ObjectId(id) },
      { $pull: { "cart.items": { productId: new ObjectId(id) } } } as any
    )
    .then((result) => {
      console.log("Removed product from user carts:", result);
    })
    .catch((err) => {
      console.log(err);
    });




    return db
      .collection("products")
      .deleteOne({ _id: new ObjectId(id) })
      .then((result) => {
        console.log("Deleted document:", result);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}




// import { DataTypes, Model, Optional } from 'sequelize';
// import { sequelize } from '../util/database';
// import { CartItem } from './cart-item';
// import { OrderItem } from './order-item';

// interface ProductAttributes {
//   id: number;
//   // userId:number;
//   title: string;
//   price: number;
//   imageUrl: string;
//   description: string;
// }
// export interface ProductInstance extends Model<ProductAttributes>, ProductAttributes {
//   UserId: number;
//   CartItem: CartItem;
//   // OrderItem: OrderItem;
//   // product: { quantity: number; };
//   OrderItem: { quantity: number; };

// }
// // export interface ProductAttributesWithUserId extends Optional<ProductAttributes, 'id'> {
// //   UserId: number;
// // }

// class Product extends Model<ProductAttributes> implements ProductInstance {
//   public id!: number;
//   // public userId!: number;
//   public title!: string;
//   public price!: number;
//   public imageUrl!: string;
//   public description!: string;
//   public UserId!: number;
//   public CartItem!: CartItem;
//   // public OrderItem!: OrderItem;
//     // public product!: { quantity: number; };
//     public OrderItem!: { quantity: number; };
// }

// Product.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       allowNull: false,
//       primaryKey: true,
//     },
//     title: {
//       type: DataTypes.STRING,
//     },
//     price: {
//       type: DataTypes.DOUBLE,
//       allowNull: false,
//     },
//     imageUrl: {
//       type: DataTypes.STRING(),
//       allowNull: false,
//     },
//     description: {
//       type: DataTypes.STRING(),
//       allowNull: false,
//     },
   
//   },
//   {
//     sequelize,
//     tableName: 'product',
//   }
// );

// export { Product };

