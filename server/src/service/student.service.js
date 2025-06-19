/*
 * Module Name: student.service.js
 * Author: Phạm Thanh Duy
 * Created On: Wed Jun 18 2025
 * Last Modified by: Phạm Thanh Duy
 * Last Modified time: Wed Jun 18 2025 12:55:57 AM
 * Synopsis: The module provides services for managing student data, including CRUD operations, validation, and importing data from CSV/XLSX files.
 * Functions:
 * - constructor(models): Initializes the service with necessary models.
 * - getAll(searchQuery): Retrieves a paginated list of students based on filter criteria.
 * - create(newStudentInf): Creates a new student along with identity documents in a transaction.
 * - update(studentId, updateData): Updates student information with validation and optional status change check.
 * - deleteStudents(studentIds): Deletes multiple students by their IDs.
 * - importFile(fileBuffer, format): Imports student data from CSV or XLSX file.
 * - getStudyResultWithGPA(studentCode, searchQuery): Retrieves the student's study results and GPA (per semester or cumulative).
 *
 * Private Functions:
 * - #validateStudentData(studentInf): Validates the fields of a student object.
 * - #createIdentityDocument(docData, studentCode, transaction): Creates associated identity documents for a student.
 * - #mapStudentRow(row): Maps a row from import file to a student object.
 * - #insertStudentArray(studentsData): Inserts or updates an array of students in the database.
 * - #getStudyResultOfStudent(studentCode, searchQuery): Retrieves raw study results for a specific student.
 * - #calculateGPAOfStudent(studyResultOfStudent): Calculates GPA from the list of study results.
 * - #getHighestGradesByCourse(resultList): Filters out the highest grade per course for GPA calculation.
 *
 * Global Variables:
 * - No global variables used. All required models are injected through the constructor and stored as instance properties.
 */

const BaseService = require("./base.service");
const { importCSV, importXLSX } = require("./import.service");

const { validateStudentEmail, validatePhone, validateStatusTransition } = require("../util/validator");
const { mapSequelizeError } = require("../util/errorsMapperFromPostgres")
const { NotFoundError, ValidationError } = require("../util/errors");
const initModels = require("../models/init-models");
const sequelize = require("../config/db");

const { Op, where } = require("sequelize");
const { omit } = require("lodash");


class StudentService extends BaseService {

	constructor(models = initModels(sequelize)) {
		super(models.Student);
		this.IdentityDocument = models.IdentityDocument;
		this.Faculty = models.Faculty;
		this.Program = models.Program;
		this.ClassRegistration = models.ClassRegistration;
		this.Class = models.Class;
		this.Course = models.Course;
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

	#mapStudentRow(row) {
		return {
			studentCode: row.studentCode || null,
			fullName: row.fullName || null,
			dateOfBirth: row.dateOfBirth || null,
			email: row.email || null,
			phoneNumber: row.phoneNumber || null,
			nationality: row.nationality || null,
			facultyCode: row.facultyCode || null,
			cohortYear: row.cohortYear || null,
			status: row.status || null,
			programCode: row.programCode || null,
			gender: row.gender || null,
		};
	}

	async importFile(fileBuffer, format) {
		let students;
		if (format === 'csv') {
			students = await importCSV(fileBuffer, this.#mapStudentRow);
		}
		else if (format === 'xlsx') {
			students = importXLSX(fileBuffer, this.#mapStudentRow);
		}
		else {
			throw new ValidationError("Format invalid", "Hệ thống không hỗ trợ định dạng này.");
		}
		return await this.#insertStudentArray(students);
	}

	async #insertStudentArray(studentsData) {
		const results = [];
		const errors = [];
		for (const studentData of studentsData) {
			try {
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
				};

				await this.#validateStudentData(studentUpsertData);

				const [student, created] = await this.model.upsert(studentUpsertData, {
					conflictFields: ["student_code"],
				});

				results.push({
					studentCode: student.studentCode,
					action: created ? "inserted" : "updated",
					success: true,
				});

			} catch (error) {
				const mappedError = mapSequelizeError(error);
				errors.push(mappedError);

				results.push({
					studentCode: studentData.studentCode,
					action: "failed",
					error: mappedError.message,
					success: false,
				});
			}
		}

		if (errors.length > 0) {
			throw new ValidationError(
				"Some records failed to insert.",
				"Một số dòng bị lỗi khi chèn dữ liệu.",
				results
			);
		}

		return results;
	}


	async #getStudyResultOfStudent(studentCode, searchQuery) {
		try {
			if (!studentCode) {
				throw new ValidationError("Student code is required", "Mã sinh viên là bắt buộc");
			}
			let resultOfStudent = await this.ClassRegistration.findAll({
				where: { studentCode },
				include: [
					{
						model: this.Class,
						as: "classCodeClass",
						attributes: ["courseCode", "semester", "academicYear"],
						where: {
							...(searchQuery?.semester && searchQuery?.academicYear && { semester: searchQuery.semester }),
							...(searchQuery?.academicYear && { academicYear: searchQuery.academicYear }),
						},
						include: [
							{
								model: this.Course,
								as: "courseCodeCourse",
								attributes: ["name", "credits"],
							},
						],
					},
				],
				attributes: {
					exclude: ["studentCode", "createdAt", "updatedAt"],
				},
				order: [["createdAt", "DESC"]],
			});

			return resultOfStudent.map(item => {
				const classInfo = item.classCodeClass;
				const courseInfo = classInfo.courseCodeCourse;
				return {
					classCode: item.classCode,
					grade: item.grade,
					isPass: item.isPass,
					note: item.note,
					courseCode: classInfo.courseCode,
					semester: classInfo.semester,
					academicYear: classInfo.academicYear,
					courseName: courseInfo.name,
					credits: courseInfo.credits,
				};
			}

			)
		} catch (error) {
			throw mapSequelizeError(error);
		}
	}

	async getStudyResultWithGPA(studentCode, searchQuery) {
		const resultList = await this.#getStudyResultOfStudent(studentCode, searchQuery);
		if (searchQuery.semester && searchQuery.academicYear) {
			const { gpa, totalCredits } = await this.#calculateGPAOfStudent(resultList);
			return { resultList, gpa, totalCredits };
		}
		const highestMap = await this.#getHighestGradesByCourse(resultList);
		const highestList = Array.from(highestMap.values());
		const { gpa, totalCredits } = await this.#calculateGPAOfStudent(highestList);
		return { resultList: highestList, gpa, totalCredits };
	}


	async #calculateGPAOfStudent(studyResultOfStudent) {
		let totalGradeXCredits = 0;
		let totalCredits = 0;
		for (const item of studyResultOfStudent) {
			if (item.grade == null || item.credits == null) continue;
			totalGradeXCredits += item.grade * item.credits;
			totalCredits += item.credits;
		}
		const gpa = totalCredits > 0 ? (totalGradeXCredits / totalCredits).toFixed(2) : null;
		return {
			gpa: gpa ? parseFloat(gpa) : null,
			totalCredits,
		};
	}

	async #getHighestGradesByCourse(resultList) {
		const courseGradeMap = new Map();
		for (const item of resultList) {
			const { courseCode, courseName, classCode, isPass, note, semester, academicYear, grade, credits } = item;

			if (grade == null || courseCode == null || credits == null) continue;

			const current = courseGradeMap.get(courseCode);

			if (!current || grade > current.grade) {
				courseGradeMap.set(courseCode, { courseCode, courseName, classCode, isPass, note, semester, academicYear, grade, credits });
			}
		}

		return courseGradeMap;
	}


}

module.exports = StudentService;
