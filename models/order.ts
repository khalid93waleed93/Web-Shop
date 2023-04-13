import { ObjectId } from "mongoose";
import mongoose, {Document, Schema} from "mongoose";
import { Product, IProduct } from "./product";
import { User, IUser } from "./user";

interface IOrder extends Document {
    user:{
        email: string,
        userId: ObjectId
    }
    products: {
        product: IProduct,
        quantity: number
    }[]
}
const orderSchema = new Schema<IOrder>({
    user:{
        email: {
            type: String,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User"
        }
    },
    products: [
        {
            product: {
                type: Object,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ]
})
export const OrderModel = mongoose.model<IOrder>("Order", orderSchema)

export class Order {
 
    private _orderModel: IOrder
   
     constructor( user:{}, products:{}[]){
       this._orderModel = new OrderModel({user,products})
       
     }
     async save (){
      await this._orderModel.save()
     }
     static findById(id: string) {
       return OrderModel.findById(id);
     }
     static async findOne(): Promise<IOrder | null> {
       return await OrderModel.findOne();
     }
     static async findByUserId(userId:ObjectId){
        return await OrderModel.find({ "user.userId":userId })
     }
}