import { ObjectId } from "mongoose";
import mongoose, {Document, Schema} from "mongoose";
import { Product, IProduct } from "./product";
interface ICartItem {
  
  productId: ObjectId;
  quantity: number;
  
}

export interface IUser extends Document {
    password: string;
    email: string;
    cart: {
      items:ICartItem[]
    }
    resetToken?: string;
    resetTokenExpiration?: Date;
    addToCart: (product: IProduct) => Promise<IUser>;
    deleteItemFromCart: (productId: string) => Promise<IUser>;
    clearCart: () => Promise<IUser>;
    
}
const userSchema = new Schema<IUser>({
  password:{
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref:"Product" ,required: true },
        quantity: { type: Number, required: true }
      }
    ]
  },
  resetToken: String,
  resetTokenExpiration: Schema.Types.Date
})
userSchema.methods.addToCart = function(product:IProduct){
  const cartProductIndex = this.cart.items.findIndex((cp:ICartItem) => {
          // return cp.productId.toString() === product._id?.toString();
          if(cp.productId){
            return cp.productId.toString() === product._id.toString();
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
            productId: product._id,
            quantity: newQuantity
          });
        }
        const updatedCart = {
          items: updatedCartItems
        };
        this.cart = updatedCart
        return this.save()
        
}
userSchema.methods.deleteItemFromCart = function(productId:string){
  const updatedCartItems = this.cart.items.filter((cp:ICartItem) => {
    return cp.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save()
}
userSchema.methods.clearCart = function(){
  this.cart = { items: [] }  
  return this.save()
}
export const UserModel = mongoose.model<IUser>('User', userSchema)
export class User {
 
 private _userModel: IUser

  constructor( password: string, email: string, cart:{items:ICartItem[]}){
    this._userModel = new UserModel({password,email,cart})
    
  }
  async save (){
   return await this._userModel.save()
  }
  static findById(id: string) {
    return UserModel.findById(id);
  }
  static async findByEmail(email:string): Promise<IUser | null> {
    return await UserModel.findOne({email:email});
  }
  static async findByToken(token:string, id?:string): Promise<IUser | null> {
    if(id){
      return await UserModel.findOne({resetToken: token, resetTokenExpiration:{$gt: Date.now()}, _id:id});
    } else {
      return await UserModel.findOne({resetToken: token, resetTokenExpiration:{$gt: Date.now()}});
    }
    
  }
  

//   addOrder(){
//     const db = getDb();
//     return this.getCart()
//     .then(products => {
//       const order:Order = {
//         items: products,
//         user: {
//           _id: this._id!,
//           name: this.name
//         }
//       };
//       return db.collection('orders').insertOne(order)
//     })
//     .then(result => {
//       this.cart = {items:[]};
//       return db
//         .collection('users')
//         .updateOne({_id:this._id},{ $set:{ cart: { items: [] } } })
//     })
//     .catch(err => console.log(err))
//   }

//   getOrders(){
//     const db = getDb();
//     return db.collection<Order>('orders')
//     .find({'user._id':new ObjectId(this._id)})
//     .toArray()
//   }
  // static fromMongoDocument(document: UserDocument): User {
  //   const { _id, name, email } = document;
  //   const user = new User(name, email, _id.toString());
  //   return user;
  // }
}


