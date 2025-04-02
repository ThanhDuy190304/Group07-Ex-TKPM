const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Program', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    programCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "programs_short_name_key"
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    tableName: 'programs',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "programs_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "programs_program_code_unique",
        unique: true,
        fields: [
          { name: "program_code" },
        ]
      },
      {
        name: "programs_short_name_key",
        unique: true,
        fields: [
          { name: "program_code" },
        ]
      },
    ]
  });
};
