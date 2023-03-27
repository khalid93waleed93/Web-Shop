import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../util/database';

interface ProductAttributes {
  id: number;
  // userId:number;
  title: string;
  price: number;
  imageUrl: string;
  description: string;
}
// export interface ProductAttributesWithUserId extends Optional<ProductAttributes, 'id'> {
//   UserId: number;
// }

class Product extends Model<ProductAttributes> {
  public id!: number;
  // public userId!: number;
  public title!: string;
  public price!: number;
  public imageUrl!: string;
  public description!: string;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
   
  },
  {
    sequelize,
    tableName: 'products',
  }
);

export { Product };


// import { query } from '../util/database';
// import { rootDir } from '../util/path';
// import { Cart } from './cart'; 

// export interface ProductProps {
//     title: string;
//     description: string;
//     imageUrl: string;
//     price: number;
//     id:string | null;
// }

// export class Product implements ProductProps {
  
//   title: string;
//   description: string;
//   price: number;
//   imageUrl: string;
//   id: string | null;

//   constructor({ id, title, description, price, imageUrl }: ProductProps) {
//     this.title = title;
//     this.description = description;
//     this.price = price;
//     this.imageUrl = imageUrl;
//     this.id = id;
//   }

//   save() {
//     return query('insert into products (title, price, imageUrl, description) values ($1, $2, $3, $4)',
//     [this.title, this.price, this.imageUrl, this.description])
    
//   }
//   static deleteById(id:string){

//   }
//   static fetchAll() {
//    return query('select * from products');
//   }

//   static findById(id:string) {
//     // return query(`select * from products where id = ${id}`)
//     return query('select * from products where id = $1', [parseFloat(id)])

//   }

// }
