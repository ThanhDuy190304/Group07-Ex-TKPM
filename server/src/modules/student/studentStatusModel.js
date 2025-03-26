const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const StudentStatus = sequelize.define(
    "StudentStatus",
    {
        statusId: {
            type: DataTypes.STRING,
            primaryKey: true,
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
