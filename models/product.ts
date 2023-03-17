import fs from 'fs';
import path from 'path';
import { rootDir } from '../util/path';

export interface ProductProps {
    title: string;
    description: string;
    price: number;
  }
const p = path.join(rootDir,'data','products.json');
const createDataDirectory = () => {
  const dirPath = path.join(rootDir, 'data');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
}
const getDataFromFile = (callback: (arg0: never[]) => void) =>{
  fs.readFile(p,(err,fileContent) => {
    if(err){
      createDataDirectory()
      callback([]);
    } else {
    callback(JSON.parse(fileContent.toString()))
    }
})
  
}
export class Product {
  title: string;
  description: string;
  price: number;

  constructor({ title, description, price }: ProductProps) {
    this.title = title;
    this.description = description;
    this.price = price;
  }

  save() {
    getDataFromFile((products: this[]) => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products),(err)=>{
          err?console.log(err):null;
      })
    })  
  }
  static fetchAll(callback: (arg0: never[]) => void) {
    getDataFromFile(callback)
  }
}
