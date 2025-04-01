const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const StudentStatus = sequelize.define(
    "StudentStatus1",
    {
        statusId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    },
    {
        timestamps: false,
        tableName: "student_statuses1",
    }
);

module.exports = StudentStatus;
