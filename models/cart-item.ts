import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../util/database';

interface CartItemAttributes {
  id: number;
  quantity: number;
}


class CartItem extends Model<CartItemAttributes> {
  public id!: number;
  public quantity!: number;
  
}

CartItem.init(
  {
    id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    },
    quantity: DataTypes.INTEGER
  },
  {
    sequelize,
    tableName: 'cartItem',
  }
);

export { CartItem };

