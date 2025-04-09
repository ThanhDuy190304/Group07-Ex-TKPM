const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Class', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    classCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "classes_class_code_key"
    },
    courseCode: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'courses',
        key: 'course_code'
      }
    },
    semester: {
      type: DataTypes.ENUM("Kỳ 1", "Kỳ 2", "Kỳ 3"),
      allowNull: false,
    },
    academicYear: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ""
    },
    instructor: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    maxStudents: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    room: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    schedule: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'classes',
    schema: 'public',
    indexes: [
      {
        name: "classes_class_code_key",
        unique: true,
        fields: [
          { name: "class_code" },
        ]
      },
      {
        name: "classes_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
