const DataTypes = require("sequelize");
const sequelize = require("../../config/database");

const Faculty = sequelize.define(
    "Faculty",
    {
        facultyId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING, // e.g. "Công nghệ thông tin"
            allowNull: false,
        },
        short_name: {
            type: DataTypes.STRING, // e.g. "CNTT"
            allowNull: false,
        },
    },
    {
        tableName: "faculty",
        timestamps: true,
    }
);

module.exports = Faculty;
