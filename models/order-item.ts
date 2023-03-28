import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../util/database';

interface OrderItemAttributes {
  id: number;
  quantity: number;
}


class OrderItem extends Model<OrderItemAttributes> {
  public id!: number;
  public quantity!: number;
  
}

OrderItem.init(
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
    tableName: 'orderItem',
  }
);

export { OrderItem };

