import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../util/database';
import { Product } from './product';

export interface CartAttributes {
  id?: number;
}
interface CartInstance extends Model<CartAttributes>,CartAttributes{
  getProducts(options?:object): Promise<Product[]>;
  addProduct(product: Product, options?: object): Promise<void>;
  setProducts(products: Product[]): Promise<void>
}

class Cart extends Model<CartAttributes> implements CartInstance {
  public id!: number;
  public getProducts!:(options?:object) => Promise<Product[]>;
  public addProduct!:(product: Product, options?: object) => Promise<void>;
  public setProducts!:(products: Product[] | null) => Promise<void>

  
}

Cart.init(
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
    tableName: 'cart',
  }
);

export { Cart };

