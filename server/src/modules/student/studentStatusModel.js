const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const StudentStatus = sequelize.define(
    "StudentStatus",
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
        tableName: "student_statuses",
    }
);

module.exports = StudentStatus;
