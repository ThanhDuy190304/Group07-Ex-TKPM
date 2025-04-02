const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Faculty', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    facultyCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "faculties_short_name_key"
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'faculties',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "faculties_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "faculties_short_name_key",
        unique: true,
        fields: [
          { name: "faculty_code" },
        ]
      },
    ]
  });
};
