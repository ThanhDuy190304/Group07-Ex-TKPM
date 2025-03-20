const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const Nationality = require("../nationality/nationalityModel");

const PermanentAddress = sequelize.define(
    "permanent address",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
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
        tableName: "permanent address",
    }
);

module.exports = PermanentAddress;