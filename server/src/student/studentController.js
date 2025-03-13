const studentService = require("../student/studentService");

// Lấy danh sách sinh viên
const getAllStudents = async (req, res) => {
  try {
    const students = await studentService.getAllStudents();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy sinh viên theo ID
const getStudentById = async (req, res) => {
  try {
    const student = await studentService.getStudentById(req.params.studentId);
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Thêm sinh viên mới
const createStudent = async (req, res) => {
  try {
    const student = await studentService.createStudent(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Cập nhật thông tin sinh viên
const updateStudent = async (req, res) => {
  try {
    const student = await studentService.updateStudent(
      req.params.studentId,
      req.body
    );
    res.status(200).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Xóa sinh viên
const deleteStudent = async (req, res) => {
  try {
    await studentService.deleteStudent(req.params.studentId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Tìm kiếm sinh viên
const searchStudents = async (req, res) => {
  try {
    const students = await studentService.searchStudents(req.query.q);
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  searchStudents,
};
