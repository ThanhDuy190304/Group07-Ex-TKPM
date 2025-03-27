const DataTypes = require("sequelize");
const sequelize = require("../../config/database");

const Faculty = sequelize.define(
    "Faculty",
    {
        facultyId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        short_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "faculties",
        timestamps: true,
    }
);

module.exports = Faculty;
