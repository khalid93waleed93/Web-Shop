import { DataTypes, Model } from "sequelize";
import { sequelize } from "../util/database";
import { Cart } from "./cart";
import { Order } from "./order";
import { Product } from "./product";

interface UserAttributes {
    id?: number;
    name: string;
    email: string;
    
}
export interface UserInstance extends Model<UserAttributes>, UserAttributes {
  createCart(): Promise<Cart>;
  getCart(): Promise<Cart | null>;
  getOrders(options?:object): Promise<Order[]>;
  getProducts(options?:object): Promise<Product[]>;
  createProduct(product?: Partial<Product>): Promise<Product>;
  createOrder(order?: Partial<Order>): Promise<Order>
}
class User extends Model<UserAttributes> implements UserInstance {
    
    // [x: string]: any;
    public id!: number;
    public name!: string;
    public email!: string;
    public createCart!: () => Promise<Cart>;
    public getCart!:() => Promise<Cart | null>;
    public getProducts!:(options?:object) => Promise<Product[]>;
    public createProduct! :(product?: Partial<Product>) => Promise<Product>;
    public createOrder!:(order?: Partial<Order>) => Promise<Order>;
    public getOrders!:(options?:object) => Promise<Order[]>;


}
  
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      
      email: {
        type: DataTypes.STRING,
        allowNull: false
      }
      
    },
    {
      sequelize,
      tableName: 'user',
    });
  
  export { User };
  