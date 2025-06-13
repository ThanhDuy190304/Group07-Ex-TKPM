const { Sequelize } = require('sequelize');
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
        define: {
            schema: 'public',
        },
        logging: false, // Set to true to see SQL queries in console
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        define: {
            underscored: true, // tự động chuyển camelCase -> snake_case
            timestamps: true // tự động thêm createdAt, updatedAt
        },
        pool: {
            max: 20,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
    }
);

module.exports = sequelize;
