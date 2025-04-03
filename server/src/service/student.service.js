const BaseService = require("./base.service");
const CsvImportService = require("./csv.service");


const { validateEmail, validatePhone, validateUUID } = require("../util/validator");
const { NotFoundError, ValidationError } = require("../util/errors");
const initModels = require("../models/init-models");
const sequelize = require("../config/db");
const { Op } = require("sequelize");
const { omit } = require("lodash");

const models = initModels(sequelize);

class StudentService extends BaseService {
  constructor() {
    super(models.Student);
  }
  static validateStudentData_noId(data) {
    if (data?.email && !validateEmail(data.email)) {
      throw new ValidationError(
        "Invalid Email. The email must end with @student.university.edu.vn",
        "Email không hợp lệ. Email phải kết thúc với @student.university.edu.vn"
      );
    }
    // if (data?.phoneNumber && !validatePhone(data.phoneNumber, data?.nationalityId)) {
    //   throw new ValidationError("Invalid phone number.", "Số điện thoại không hợp lệ");
    // }
  }

  async getAll(searchQuery) {
    const whereClause = {};
    if (searchQuery?.studentCode) whereClause.studentCode = searchQuery?.studentCode;
    else {
      if (searchQuery?.fullName)
        whereClause.fullName = { [Op.like]: `%${searchQuery?.fullName}%` };
      if (searchQuery?.facultyCode) whereClause.facultyCode = searchQuery?.facultyCode;
      if (searchQuery?.cohortYear) whereClause.cohortYear = searchQuery?.cohortYear;
      if (searchQuery?.programCode) whereClause.programCode = searchQuery?.programCode;
    }
    const sortOrder = searchQuery?.sortOrder === "desc" ? "DESC" : "ASC";

    const limitNum = searchQuery?.limit ? parseInt(searchQuery?.limit, 10) : null;
    const pageNum = searchQuery?.page ? parseInt(searchQuery?.page, 10) : 1;
    const include = [
      {
        model: models.IdentityDocument,
        as: "identityDocuments", // Alias đã định nghĩa trong quan hệ
        attributes: {
          exclude: ["studentCode", "createdAt", "updatedAt"], // Loại trừ các trường không cần thiết
        },
        required: false,
      },
    ]

    if (!limitNum) {
      const { rows, count } = await this.model.findAndCountAll({
        where: whereClause,
        order: [["studentCode", sortOrder]],
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        include
      });
      return {
        students: rows,
        total: count,
      };
    }
    const offset = (pageNum - 1) * limitNum;
    const { rows, count } = await this.model.findAndCountAll({
      where: whereClause,
      order: [["studentCode", sortOrder]],
      limit: limitNum,
      offset: offset,
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
      include
    });
    return { students: rows, total: count }
  }

  async update(studentId, updateData) {
    if (!validateUUID(studentId)) {
      throw new ValidationError();
    }
    const student = await this.model.findOne({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundError("Student not exists", "Sinh viên này không tồn tại");
    }
    StudentService.validateStudentData_noId(updateData);
    const updateFields = omit(updateData, ['id', 'studentCode']);
    const updatedStudent = await student.update(updateFields);
    return {
      student: omit(updatedStudent.get({ plain: true }), ["createdAt", "updatedAt"])
    };
  }

  async create(newStudentInf) {
    const requiredFields = [
      "studentCode",
      "fullName",
      "dateOfBirth",
      "gender",
      "email",
      "phoneNumber",
      "facultyCode",
      "programCode",
      "cohortYear",
    ];
    const missingFields = requiredFields.filter((field) => !newStudentInf[field]);
    if (missingFields.length > 0) {
      throw new ValidationError(
        `Missing required fields: ${missingFields.join(", ")}`,
        `Thiếu các trường bắt buộc: ${missingFields.join(", ")}`
      );
    }

    if (newStudentInf?.studentCode) {
      const student = await this.model.findOne({ where: { studentCode: newStudentInf.studentCode } });
      if (student) {
        throw new ValidationError("Student code already exists", "Mã sinh viên này đã tồn tại");
      }
    }
    StudentService.validateStudentData_noId(newStudentInf);
    const newStudent = await this.model.create(newStudentInf);
    return {
      student: omit(newStudent.get({ plain: true }), ["createdAt", "updatedAt"])
    }
  }
  async importFile(fileBuffer, format) {
    let students;
    if (format === 'csv') {
      students = await CsvImportService.importStudents(fileBuffer);
    }
    else {
      throw new ValidationError("Format invalid", "Hệ thống không hỗ trợ định dạng này.");
    }
    return await this.#insertStudentArray(students);
  }

  async #insertStudentArray(studentsData) {
    const [faculties, programs] = await Promise.all([
      models.Faculty.findAll(),
      models.Program.findAll(),
    ]);
    const results = [];
    for (const studentData of studentsData) {
      const transaction = await sequelize.transaction();
      try {
        const faculty = faculties.find(f => f.facultyCode === studentData.facultyCode);
        const program = programs.find(p => p.programCode === studentData.programCode);
        if (!faculty) {
          throw new ValidationError(`Faculty code not found: ${studentData.facultyCode}`,
            `Mã khoa không tồn tại: ${studentData.facultyCode}`);
        }
        if (!program) {
          throw new ValidationError(`Program code not found: ${studentData.programCode}`,
            `Mã chương trình không tồn tại: ${studentData.facultyCode}`);
        }
        const studentUpsertData = {
          studentCode: studentData.studentCode,
          fullName: studentData.fullName,
          dateOfBirth: new Date(studentData.dateOfBirth),
          gender: studentData.gender,
          email: studentData.email,
          phoneNumber: studentData.phoneNumber,
          facultyCode: studentData.facultyCode,
          status: studentData.status,
          cohortYear: studentData.cohortYear,
          programCode: studentData.programCode,
          nationality: studentData.nationality,
          emporaryResidenceAddress: studentData.temporaryResidenceAddress,
          permanentAddress: studentData.permanentAddress,
          mailAddress: studentData.mailAddress,
        };
        StudentService.validateStudentData_noId(studentUpsertData);
        const [student, created] = await models.Student.upsert(studentUpsertData, {
          transaction,
          conflictFields: ["student_code"],
        });
        await transaction.commit();
        results.push({
          studentCode: student.studentCode,
          action: created ? "inserted" : "updated",
          success: true,
        });
      } catch (error) {
        await transaction.rollback();
        results.push({
          studentCode: studentData.studentCode,
          action: "failed",
          error: error.message,
          success: false,
        });
      }
    }
    return results;
  }
}

module.exports = new StudentService();
