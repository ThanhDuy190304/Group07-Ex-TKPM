const BaseService = require("./base.service");
const CsvImportService = require("./csv.service");

const { validateStudentEmail, validatePhone, validateStatusTransition } = require("../util/validator");
const { mapSequelizeError } = require("../util/errorsMapperFromPostgres")
const { NotFoundError, ValidationError } = require("../util/errors");
const initModels = require("../models/init-models");
const sequelize = require("../config/db");

const { Op } = require("sequelize");
const { omit } = require("lodash");


class StudentService extends BaseService {

  constructor(models = initModels(sequelize)) {
    super(models.Student);
    this.IdentityDocument = models.IdentityDocument;
    this.Faculty = models.Faculty;
    this.Program = models.Program;
  }

  async #validateStudentData(studentInf) {
    //Check email
    if (studentInf?.email && !validateStudentEmail(studentInf.email)) {
      throw new ValidationError(
        "Invalid Email. The email must end with @student.university.edu.vn",
        "Email không hợp lệ. Email phải kết thúc với @student.university.edu.vn"
      );
    }
    //Check number 
    if (studentInf?.phoneNumber) {
      if (!validatePhone(studentInf.phoneNumber)) {
        throw new ValidationError("Phone number must match with the country code.", "Số điện thoại không khớp với mã quốc gia");
      }
    }
  }

  async getAll(searchQuery) {
    console.log(searchQuery);
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
        model: this.IdentityDocument,
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
    const student = await this.model.findOne({ where: { id: studentId } });
    if (updateData?.status) {
      if (!validateStatusTransition(student.status, updateData.status))
        throw new ValidationError("Invalid status student", "Trạng thái sinh viên không hợp lệ");
    }
    await this.#validateStudentData(updateData);
    const updateFields = omit(updateData, ['id', 'studentCode']);
    try {
      await student.update(updateFields);
    } catch (err) {
      throw mapSequelizeError(err);
    }
  }

  async create(newStudentInf) {
    const requiredFields = ["studentCode", "fullName", "dateOfBirth", "gender", "email", "phoneNumber",
      "facultyCode", "programCode", "cohortYear", "nationality", 'identityDocuments'
    ];
    const missingFields = requiredFields.filter((field) => !newStudentInf[field]);
    if (missingFields.length > 0) {
      throw new ValidationError(
        `Missing required fields: ${missingFields.join(", ")}`,
        `Thiếu các trường bắt buộc: ${missingFields.join(", ")}`
      );
    }
    await this.#validateStudentData(newStudentInf);
    const transaction = await this.model.sequelize.transaction();
    try {
      const newStudent = await this.model.create(newStudentInf, { transaction });
      await this.#createIdentityDocument(newStudentInf.identityDocuments[0], newStudent.studentCode, transaction);
      await transaction.commit();

    } catch (error) {
      await transaction.rollback();
      throw mapSequelizeError(error);
    }
  }

  async #createIdentityDocument(docData, studentCode, transaction) {
    const docWithStudentCode = {
      ...docData,
      studentCode
    };
    const existingDoc = await this.IdentityDocument.findOne({
      where: { number: docWithStudentCode.number }
    });
    if (existingDoc) {
      throw new ValidationError(
        "Identity document number already exists.",
        "Số của giấy tờ tùy thân đã tồn tại."
      );
    }
    await this.IdentityDocument.create(docWithStudentCode, { transaction });
  }

  async deleteStudents(studentIds) {
    try {
      await this.model.destroy({ where: { id: studentIds } });
    } catch (error) {
      throw mapSequelizeError(error);
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
      this.Faculty.findAll(),
      this.Program.findAll(),
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
        StudentService.validateStudentData(studentUpsertData);
        const [student, created] = await this.model.upsert(studentUpsertData, {
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

module.exports = StudentService;
