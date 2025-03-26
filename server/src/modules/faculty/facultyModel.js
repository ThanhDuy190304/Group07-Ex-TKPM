const DataTypes = require("sequelize");
const sequelize = require("../../config/database");

const Faculty = sequelize.define(
    "Faculty",
    {
        facultyId: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING, // e.g. "Công nghệ thông tin"
            allowNull: false,
        },
    },
    {
        tableName: "faculties",
        timestamps: true,
    }
);

module.exports = Faculty;
