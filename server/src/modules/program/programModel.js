const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Program = sequelize.define(
    "Program",
    {
        programId: {
            type: DataTypes.STRING, // e.g., "CQ"
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING, // e.g., "Chính quy"
            allowNull: false,
        },
    },
    {
        timestamps: true,
        tableName: "program",
    }
);

module.exports = Program;
