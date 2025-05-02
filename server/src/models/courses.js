const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Course', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    courseCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "courses_course_code_key"
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    credits: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    facultyCode: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'faculties',
        key: 'faculty_code'
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    prerequisiteCourseCode: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'courses',
    schema: 'public',
    indexes: [
      {
        name: "courses_pkey",
        unique: true,
        fields: [
          { name: "course_code" },
        ]
      },
    ]
  });
};
