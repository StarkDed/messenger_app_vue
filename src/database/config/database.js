import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: process.env.VUE_APP_DB_PASSWORD,
    database: 'message_app_vue',
    logging: false
});

export default sequelize; 