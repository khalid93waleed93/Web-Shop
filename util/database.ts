import {Sequelize} from "sequelize";

const databaseUrl = process.env.LOCAL_DATABASE_URL || process.env.DATABASE_URL ;

if (!databaseUrl) {
  throw new Error('No database connection string found in environment variables');
}

export const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
});
// export const sequelize = new Sequelize('nodejs-app','postgres','lammkopf', {dialect:'postgres',host:'localhost', port:5432})
