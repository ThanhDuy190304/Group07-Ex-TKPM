const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const MailAddress = sequelize.define(
    "mailAddress",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        street: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        wards_communes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        district: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        city_province: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        nation: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    },
    {
        timestamps: true,
        tableName: "address",
    }
);

module.exports = MailAddress;