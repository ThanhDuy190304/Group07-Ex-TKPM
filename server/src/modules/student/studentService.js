const Student = require("./studentModel");
const Faculty = require("../faculty/facultyModel");

async function deleteStudent(studentId) {
    try {
        const deleted = await Student.destroy({
            where: { studentId },
        });
        if (deleted === 0) {
            return "Unknown student";
        }
        return null;
    } catch (error) {
        console.error("Error in studentService.deleteStudent: ", error.message);
        throw new Error("Error server");
    }
}

async function createStudent(newStudent) {
    try {
        const existingStudent = await Student.findOne({ where: { email: newStudent.email } });
        if (existingStudent) {
            return { error: "Email đã tồn tại. Vui lòng chọn email khác." };
        }
        const student = await Student.create(newStudent);
        return { success: true, student };
    } catch (error) {
        console.error("Error in studentService.createStudent: ", error.message);
        throw new Error("Error server");
    }
}

async function updateStudent(studentId, updatedData) {
    try {
        const student = await Student.findOne({ where: { studentId } });
        if (!student) {
            return null;
        }
        await student.update(updatedData);
        return student;
    } catch (error) {
        console.error("Error in studentService.updateStudent:", error.message);
        throw new Error("Error server");
    }
}

async function getOneStudentById(studentId) {
    try {
        const student = await Student.findOne({
            where: { studentId },
            attributes: {
                exclude: ["createdAt", "updatedAt"], // Loại bỏ 2 cột này
            },
        });
        return student;
    } catch (error) {
        console.error("Error in studentService.getOneStudentById:", error.message);
        throw new Error("Error server");
    }
}

async function getStudentsByName(fullName, page = 1, limit = 10) {
    try {
        const offset = (page - 1) * limit;
        const { count: total, rows: students } = await Student.findAndCountAll({
            where: { fullName },
            attributes: { exclude: ["createdAt", "updatedAt"] },
            limit: parseInt(limit),
            offset: parseInt(offset),
        });
        return { students, total };
    } catch (error) {
        console.error("Error in StudentService.getStudentsByName:", error.message);
        throw new Error("Error Server");
    }
}

async function getStudentsByPageLimit(page = 1, limit = 10) {
    try {
        const offset = (page - 1) * limit;
        const { count, rows: students } = await Student.findAndCountAll({
            attributes: { exclude: ["createdAt", "updatedAt"] }, // Loại bỏ các cột không cần
            limit,
            offset,
        });
        return {
            total: count,
            students
        };
    } catch (error) {
        console.error("Error in studentService.getStudentsByPageLimit:", error.message);
        throw new Error("Error server");
    }
}

module.exports = { deleteStudent, createStudent, getOneStudentById, getStudentsByName, updateStudent, getStudentsByPageLimit };
