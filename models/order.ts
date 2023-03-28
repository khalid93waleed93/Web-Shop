import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../util/database';
import { Product } from './product';

export interface OrderAttributes {
  id?: number;
}
interface OrderInstance extends Model<OrderAttributes>,OrderAttributes{
//   getProducts(options?:object): Promise<Product[]>
  addProducts(products: Product[], options?: object): Promise<void>
}

class Order extends Model<OrderAttributes> implements OrderInstance {
  public id!: number;
//   public getProducts!:(options?:object) => Promise<Product[]>;
  public addProducts!:(products: Product[], options?: object) => Promise<void>;
  
}

Order.init(
  {
    id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    }
  },
  {
    sequelize,
    tableName: 'order',
  }
);

export { Order };

