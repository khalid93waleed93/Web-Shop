




import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../util/database';
import { CartItem } from './cart-item';
import { OrderItem } from './order-item';

interface ProductAttributes {
  id: number;
  // userId:number;
  title: string;
  price: number;
  imageUrl: string;
  description: string;
}
export interface ProductInstance extends Model<ProductAttributes>, ProductAttributes {
  UserId: number;
  CartItem: CartItem;
  // OrderItem: OrderItem;
  // product: { quantity: number; };
  OrderItem: { quantity: number; };

}
// export interface ProductAttributesWithUserId extends Optional<ProductAttributes, 'id'> {
//   UserId: number;
// }

class Product extends Model<ProductAttributes> implements ProductInstance {
  public id!: number;
  // public userId!: number;
  public title!: string;
  public price!: number;
  public imageUrl!: string;
  public description!: string;
  public UserId!: number;
  public CartItem!: CartItem;
  // public OrderItem!: OrderItem;
    // public product!: { quantity: number; };
    public OrderItem!: { quantity: number; };
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
    tableName: 'product',
  }
);

export { Product };

