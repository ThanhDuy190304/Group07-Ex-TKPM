const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('class_registration_period', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    endDateTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    startDateTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    semester: {
      type: DataTypes.ENUM("Kỳ 1", "Kỳ 2", "Kỳ 3"),
      allowNull: false
    },
    academicYear: {
      type: DataTypes.SMALLINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'class_registration_period',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "course_registration_period_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
