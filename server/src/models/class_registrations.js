const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('ClassRegistrations', {
    studentCode: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'students',
        key: 'student_code'
      }
    },
    classCode: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'classes',
        key: 'class_code'
      }
    },
    grade: {
      type: DataTypes.REAL,
      allowNull: true
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'class_registrations',
    schema: 'public',
    indexes: [
      {
        name: "class_registrations_pkey",
        unique: true,
        fields: [
          { name: "student_code" },
          { name: "class_code" },
        ]
      },
    ]
  });
};
