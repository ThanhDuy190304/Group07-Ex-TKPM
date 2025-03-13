const Student = require("../student/studentModel");
const Faculty = require("../faculty/facultyModel");
const Course = require("../course/courseModel");
const Program = require("../program/programModel");
const sequelize = require("sequelize");

const getAllStudents = async () => {
  return await Student.findAll({
    include: [
      { model: Faculty, attributes: ["facultyId", "name"] },
      { model: Course, attributes: ["courseId", "startYear"] },
      { model: Program, attributes: ["programId", "name"] },
    ],
  });
};

const getStudentById = async (studentId) => {
  return await Student.findByPk(studentId, {
    include: [
      { model: Faculty, attributes: ["facultyId", "name"] },
      { model: Course, attributes: ["courseId", "startYear"] },
      { model: Program, attributes: ["programId", "name"] },
    ],
  });
};

const createStudent = async (studentData) => {
  const { studentId, facultyId, courseId, programId } = studentData;

  // Kiểm tra MSSV đã tồn tại chưa
  const existingStudent = await Student.findByPk(studentId);
  if (existingStudent) throw new Error("Student ID already exists");

  // Kiểm tra sự tồn tại của Faculty, Course, Program
  const faculty = await Faculty.findByPk(facultyId);
  const course = await Course.findByPk(courseId);
  const program = await Program.findByPk(programId);
  if (!faculty) throw new Error("Faculty not found");
  if (!course) throw new Error("Course not found");
  if (!program) throw new Error("Program not found");

  return await Student.create(studentData);
};

const updateStudent = async (studentId, studentData) => {
  const student = await Student.findByPk(studentId);
  if (!student) throw new Error("Student not found");

  return await student.update(studentData);
};

const deleteStudent = async (studentId) => {
  const student = await Student.findByPk(studentId);
  if (!student) throw new Error("Student not found");

  return await student.destroy();
};

const searchStudents = async (query) => {
  return await Student.findAll({
    where: {
      [sequelize.Op.or]: [
        { studentId: { [sequelize.Op.like]: `%${query}%` } },
        { fullName: { [sequelize.Op.like]: `%${query}%` } },
      ],
    },
    include: [
      { model: Faculty, attributes: ["facultyId", "name"] },
      { model: Course, attributes: ["courseId", "startYear"] },
      { model: Program, attributes: ["programId", "name"] },
    ],
  });
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  searchStudents,
};
