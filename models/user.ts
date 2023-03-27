import { DataTypes, Model } from "sequelize";
import { sequelize } from "../util/database";
import { CartAttributes } from "./cart";

interface UserAttributes {
    id?: number;
    name: string;
    email: string;
    
}
export interface UserInstance extends Model<UserAttributes>, UserAttributes {
  createCart(): Promise<CartAttributes>;
}
class User extends Model<UserAttributes> implements UserInstance {
    // [x: string]: any;
    public id!: number;
    public name!: string;
    public email!: string;
    public createCart!: () => Promise<CartAttributes>;

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
  