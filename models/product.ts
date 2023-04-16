import { NextFunction } from "express";
import fetch from 'node-fetch'
import mongoose, {Document, ObjectId, Schema, SchemaTypes} from "mongoose";

export interface IProduct extends Document {
    title: string;
    price: number;
    imageUrl: string;
    description: string;
    userId: ObjectId;
  }
  const productSchema = new Schema({
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Schema.Types.Decimal128,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
       ref:"User",
       required: true
    }
    
  })
  // productSchema.pre('remove', async function (next) {
  //   console.log('Ein Post mit dem Titel', this.get('title') ,'wird gelöscht.');
  //   next()
  // })
  const ProductModel = mongoose.model<IProduct>('Product',productSchema)
export class Product {
  private _productModel: IProduct;
  constructor(title: string, price: number, description: string, imageUrl: string, userId:ObjectId){
    this._productModel = new ProductModel({title, price, imageUrl, description, userId});
    
  }
  async save (id?:string) {
    if(!id){
      return await this._productModel.save()
    }else {
      const product = await Product.findById(id)
      console.log('product',product);
      
      if(product){
        console.log(product.price , this._productModel.price)
        product.title = this._productModel.title;
        product.price = this._productModel.price;
        product.description = this._productModel.description;
        product.imageUrl = this._productModel.imageUrl;
        return await product.save()
      } 
    }
  }
//  static async fetchAll(callback : NextFunction){
//     return ProductModel.find().then(async prods => {
//       if(prods){
//         await Promise.all(
//           prods.map(async e => {
//             if(!(await checkUrl(e.imageUrl))){
//               e.imageUrl = 'invalid'
//             }
//           })
//         )
//         return prods
 
//       }
//     }).catch( err =>{
//         callback(err)
//     })
//   }
static async fetchAll(callback: NextFunction) {
  try {
    const prods = await ProductModel.find();
    if (prods) {
      await Promise.all(
        prods.map(async (e) => {
          if (!(await checkUrl(e.imageUrl))) {
            e.imageUrl = 'invalid';
          }
        })
      );
      return prods;
    }
  } catch (err) {
    callback(err);
  }
}
  static findById(id:string){
    return ProductModel.findById(id)
  }
  static async deleteById(id:string) {
    // console.log(ProductModel.findByIdAndRemove(id))
    return ProductModel.findByIdAndRemove(id);
  }
 
}
async function checkUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url);
    console.log(response.status);
    
    // Überprüfen, ob der Statuscode 200 (Erfolg) ist
    return response.status === 200;
  } catch (error) {
    console.log(error);
    
    // console.error('Fehler beim Abrufen der URL:', error);
    return false;
  }
}