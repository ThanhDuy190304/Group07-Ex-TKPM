const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const StudentStatus = sequelize.define(
    "StudentStatus",
    {
        statusId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // Trạng thái không được trùng lặp
        },
        description: {
            type: DataTypes.TEXT, // Thêm mô tả nếu cần
            allowNull: true,
        },
    },
    {
        timestamps: false,
        tableName: "student_status",
    }
);

module.exports = StudentStatus;
