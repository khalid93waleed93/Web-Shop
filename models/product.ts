import fs from 'fs';
import path from 'path';
import { rootDir } from '../util/path';
import { Cart } from './cart'; 

export interface ProductProps {
    title: string;
    description: string;
    imageUrl: string;
    price: number;
    id:string | null;
}
const p = path.join(rootDir,'data','products.json');
const createDataDirectory = () => {
  const dirPath = path.join(rootDir, 'data');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
}
const getDataFromFile = (callback: (arg0: Product[]) => void) =>{
  fs.readFile(p,(err,fileContent) => {
    if(err){
      createDataDirectory()
      callback([]);
    } else {
    callback(JSON.parse(fileContent.toString()))
    }
})
  
}
export class Product implements ProductProps {
  
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  id: string | null;

  constructor({ id, title, description, price, imageUrl }: ProductProps) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.imageUrl = imageUrl;
    this.id = id;
  }

  save() {
    
    getDataFromFile((products: Product[]) => {
      if(this.id){
        const existingProductIndex = products.findIndex(prod => prod.id === this.id);
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex]= this;
        fs.writeFile(p, JSON.stringify(updatedProducts),(err)=>{
          err?console.log(err):null;
      });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products),(err)=>{
          err?console.log(err):null;
        });
      }
    }) 
  }
  static deleteById(productId:string){
    getDataFromFile(products => {
      const updatedProducts = products.filter(e =>  e.id !== productId);
      const deletedProduct = products.find(e => e.id === productId)!;
      fs.writeFile(p, JSON.stringify(updatedProducts),(err)=>{
        if(err){
          console.log(err)
        } else {
          Cart.deleteProduct(productId,deletedProduct.price)
        }
        
      });
    })

  }
  static fetchAll(callback: (arg0:Product[]) => void) {
    getDataFromFile(callback)
  }

  static findById(id:string,callback: (arg0: Product) => void) {
    
    getDataFromFile( products => {
        
      const product = products.find(p => p.id === id);
      callback(product!);
    })

  }

}
