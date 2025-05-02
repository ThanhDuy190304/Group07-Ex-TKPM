var DataTypes = require("sequelize").DataTypes;
var _class_registrations = require("./class_registrations");
var _classes = require("./classes");
var _courses = require("./courses");
var _faculties = require("./faculties");
var _identity_documents = require("./identity_documents");
var _programs = require("./programs");
var _students = require("./students");

function initModels(sequelize) {
  var class_registrations = _class_registrations(sequelize, DataTypes);
  var classes = _classes(sequelize, DataTypes);
  var courses = _courses(sequelize, DataTypes);
  var faculties = _faculties(sequelize, DataTypes);
  var identity_documents = _identity_documents(sequelize, DataTypes);
  var programs = _programs(sequelize, DataTypes);
  var students = _students(sequelize, DataTypes);

  classes.belongsToMany(students, { as: 'studentCodeStudents', through: class_registrations, foreignKey: "classCode", otherKey: "studentCode", sourceKey: "classCode" });
  students.belongsToMany(classes, { as: 'classCodeClasses', through: class_registrations, foreignKey: "studentCode", otherKey: "classCode", sourceKey: "studentCode" });
  class_registrations.belongsTo(classes, { as: "classCodeClass", foreignKey: "classCode", targetKey: "classCode" });
  classes.hasMany(class_registrations, { as: "classRegistrations", foreignKey: "classCode", sourceKey: "classCode" });
  classes.belongsTo(courses, { as: "courseCodeCourse", foreignKey: "courseCode", targetKey: "courseCode" });
  courses.hasMany(classes, { as: "classes", foreignKey: "courseCode", sourceKey: "courseCode" });
  courses.belongsTo(faculties, { as: "facultyCodeFaculty", foreignKey: "facultyCode", targetKey: "facultyCode" });
  faculties.hasMany(courses, { as: "courses", foreignKey: "facultyCode", sourceKey: "facultyCode" });
  students.belongsTo(faculties, { as: "facultyCodeFaculty", foreignKey: "facultyCode", targetKey: "facultyCode" });
  faculties.hasMany(students, { as: "students", foreignKey: "facultyCode", sourceKey: "facultyCode" });
  students.belongsTo(programs, { as: "programCodeProgram", foreignKey: "programCode", targetKey: "programCode" });
  programs.hasMany(students, { as: "students", foreignKey: "programCode", sourceKey: "programCode" });
  class_registrations.belongsTo(students, { as: "studentCodeStudent", foreignKey: "studentCode", targetKey: "studentCode" });
  students.hasMany(class_registrations, { as: "classRegistrations", foreignKey: "studentCode", sourceKey: "studentCode" });
  identity_documents.belongsTo(students, { as: "studentCodeStudent", foreignKey: "studentCode", targetKey: "studentCode" });
  students.hasMany(identity_documents, { as: "identityDocuments", foreignKey: "studentCode", sourceKey: "studentCode" });


  return {
    ClassRegistration: class_registrations,
    Class: classes,
    Course: courses,
    Faculty: faculties,
    IdentityDocument: identity_documents,
    Program: programs,
    Student: students,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
