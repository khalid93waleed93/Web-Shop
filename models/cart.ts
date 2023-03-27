import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../util/database';

export interface CartAttributes {
  id?: number;
}

class Cart extends Model<CartAttributes> {
  [x: string]: any;
  public id!: number;
  
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

