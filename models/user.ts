import { ObjectId } from "mongodb";
import { getDb } from "../util/database";
import { Product } from "./product";
type Cart = {
  // items: {productId: ObjectId; quantity: number}[]
  items: {product: Product, quantity: number}[]

}
type Order = {
  items:{
    quantity: number | undefined;
    save: () => Promise<void>;
    title: string;
    price: number;
    imageUrl: string;
    description: string;
    userId?: ObjectId | undefined;
    _id: ObjectId;
}[] ,
  user: {
    _id: ObjectId,
    name: string
  }

}
type WithId<T> = T & {
  _id: ObjectId;
};
interface IUser {
    _id?: ObjectId;
    // userId:number;
    name: string;
    email: string;
    cart: Cart

  }
  // export interface UserDocument extends WithId<Document> {
  //   name: string;
  //   email: string;
  // }
  
export class User implements IUser {
  name: string;
  email: string;
  _id?: ObjectId;
  cart: Cart

  constructor( name: string, email: string, cart: Cart ,id?: string){
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = id ? new ObjectId(id) : undefined
    
  }
  save (){
    const db = getDb();
    let dbOp;
    if(this._id){
      dbOp = db.collection('users').updateOne({_id: this._id}, {$set: this});
    } else {
      dbOp = db.collection('users').insertOne(this);
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
      .collection<User>('users')
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
      .collection('users')
      // .find({_id: new ObjectId(id)})
      // .next()
      .findOne({_id: new ObjectId(id)})
      .then( result => {
        console.log('find id',result);
         return result;
      })
      .catch(err => {
        console.log(err)
      })
  }
  static deleteById(id: string) {
    const db = getDb();
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
  addToCart(product: Product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
      console.log('test  ', product._id);
      
      // return cp.productId.toString() === product._id?.toString();
      if(cp.product && cp.product._id ){
        return cp.product._id.toString() === product._id?.toString();
      }
      

    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        // productId: product._id!,
        product: product,
        quantity: newQuantity
      });
    }
    const updatedCart = {
      items: updatedCartItems
    };
    const db = getDb();
    
    return db
      .collection('users')
      .updateOne(
        { _id: this._id },
        { $set: { cart: updatedCart } }
      );
  }
  getCart(){
    const db = getDb();
    const productIds = this.cart.items.map(i => {
      if(i.product && i.product._id){
        return i.product._id;
      }
      return new ObjectId()
    })
    return db
      .collection<Product>('products')
      .find({_id:{$in: productIds}})
      .toArray()
      .then(products => {
        return products.map( p =>{
          return{
            ...p,
            quantity: this.cart.items.find( i => {
              if(i.product && i.product._id){
                return i.product._id.toString() === p._id.toString();
              }
              
            })?.quantity
          }
        })
      })
  }
 async deleteItemFromCart(productId: ObjectId){
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.product._id!.toString() === productId.toString();
    });
  
    if (cartProductIndex >= 0) {
      const updatedCartItems = [...this.cart.items];
      updatedCartItems.splice(cartProductIndex, 1);
      const updatedCart = { items: updatedCartItems };
      const db = getDb();
      await db.collection<User>('users').updateOne(
        { _id: this._id },
        { $set: { cart: updatedCart } }
      );
    }
    /*
    const updatedCartItems = this.cart.items.filter(cp => {
    return cp.productId.toString() !== productId.toString();
    });

  // Check if the number of items has decreased, which means an item was removed
    if (this.cart.items.length !== updatedCartItems.length) {
      const updatedCart = { items: updatedCartItems };
      const db = getDb();
      await db.collection('users').updateOne(
        { _id: this._id },
        { $set: { cart: updatedCart } }
      );
    }
    */
  }
  addOrder(){
    const db = getDb();
    return this.getCart()
    .then(products => {
      const order:Order = {
        items: products,
        user: {
          _id: this._id!,
          name: this.name
        }
      };
      return db.collection('orders').insertOne(order)
    })
    .then(result => {
      this.cart = {items:[]};
      return db
        .collection('users')
        .updateOne({_id:this._id},{ $set:{ cart: { items: [] } } })
    })
    .catch(err => console.log(err))
  }

  getOrders(){
    const db = getDb();
    return db.collection<Order>('orders')
    .find({'user._id':new ObjectId(this._id)})
    .toArray()
  }
  // static fromMongoDocument(document: UserDocument): User {
  //   const { _id, name, email } = document;
  //   const user = new User(name, email, _id.toString());
  //   return user;
  // }
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







// import { DataTypes, Model } from "sequelize";
// import { sequelize } from "../util/database";
// import { Cart } from "./cart";
// import { Order } from "./order";
// import { Product } from "./product";

// interface UserAttributes {
//     id?: number;
//     name: string;
//     email: string;
    
// }
// export interface UserInstance extends Model<UserAttributes>, UserAttributes {
//   createCart(): Promise<Cart>;
//   getCart(): Promise<Cart | null>;
//   getOrders(options?:object): Promise<Order[]>;
//   getProducts(options?:object): Promise<Product[]>;
//   createProduct(product?: Partial<Product>): Promise<Product>;
//   createOrder(order?: Partial<Order>): Promise<Order>
// }
// class User extends Model<UserAttributes> implements UserInstance {
    
//     // [x: string]: any;
//     public id!: number;
//     public name!: string;
//     public email!: string;
//     public createCart!: () => Promise<Cart>;
//     public getCart!:() => Promise<Cart | null>;
//     public getProducts!:(options?:object) => Promise<Product[]>;
//     public createProduct! :(product?: Partial<Product>) => Promise<Product>;
//     public createOrder!:(order?: Partial<Order>) => Promise<Order>;
//     public getOrders!:(options?:object) => Promise<Order[]>;


// }
  
//   User.init(
//     {
//       id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//       },
//       name: {
//         type: DataTypes.STRING,
//         allowNull: false
//       },
      
//       email: {
//         type: DataTypes.STRING,
//         allowNull: false
//       }
      
//     },
//     {
//       sequelize,
//       tableName: 'user',
//     });
  
//   export { User };
  