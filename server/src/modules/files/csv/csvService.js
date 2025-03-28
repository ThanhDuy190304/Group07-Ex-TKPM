const csv = require("csv-parser");
const { Readable } = require("stream");
const Student = require("../../student/studentModel");
const Faculty = require("../../faculty/facultyModel");
const Course = require("../../course/courseModel");
const StudentStatus = require("../../student/studentStatusModel");
const Program = require("../../program/programModel");
const Nationality = require("../../nationality/nationalityModel");
const OIDCard = require("../../student/oidCardModel");
const NIDCard = require("../../student/nidCardModel");
const Passport = require("../../student/passportModel");
const sequelize = require("../../../config/database");
const mapStudentToCSVRow = (student) => {
  // const idDoc = student.idDocument;

  const oidCard = student.oidCard;
  const nidCard = student.nidCard;
  const passport = student.passport;

  let idDocFields = {
    cmndNumber: oidCard?.id,
    cmndIssueDate: oidCard?.dateOfIssue,
    cmndIssuePlace: oidCard?.placeOfIssue,
    cmndExpiryDate: oidCard?.expiryOfIssue,
    cccdNumber: nidCard?.id,
    cccdIssueDate: nidCard?.dateOfIssue,
    cccdIssuePlace: nidCard?.placeOfIssue,
    cccdExpiryDate: nidCard?.expiryOfIssue,
    cccdHasChip: nidCard?.chip,
    passportNumber: passport?.id,
    passportIssueDate: passport?.dateOfIssue,
    passportIssuePlace: passport?.placeOfIssue,
    passportExpiryDate: passport?.expiryOfIssue,
    passportCountry: passport?.country,
    passportNotes: passport?.note,
  };

  return {
    MSSV: student.studentId,
    "Họ tên": student.fullName,
    "Ngày sinh": student.dateOfBirth,
    "Giới tính": student.gender,
    Khoa: student.faculty?.name || "",
    Khóa: student.course?.courseId || "",
    "Chương trình": student.program?.name || "",
    "Địa chỉ tạm trú - Đường": student.temporaryResidenceAddress?.street || "",
    "Địa chỉ tạm trú - Phường/Xã":
      student.temporaryResidenceAddress?.wards_communes || "",
    "Địa chỉ tạm trú - Quận/Huyện":
      student.temporaryResidenceAddress?.district || "",
    "Địa chỉ tạm trú - Tỉnh/Thành phố":
      student.temporaryResidenceAddress?.city_province || "",
    "Địa chỉ tạm trú - Quốc gia":
      student.temporaryResidenceAddress?.nation || "",
    "Địa chỉ thường trú - Đường": student.permanentAddress?.street || "",
    "Địa chỉ thường trú - Phường/Xã":
      student.permanentAddress?.wards_communes || "",
    "Địa chỉ thường trú - Quận/Huyện": student.permanentAddress?.district || "",
    "Địa chỉ thường trú - Tỉnh/Thành phố":
      student.permanentAddress?.city_province || "",
    "Địa chỉ thường trú - Quốc gia": student.permanentAddress?.nation || "",
    "Địa chỉ nhận thư - Đường": student.mailAddress?.street || "",
    "Địa chỉ nhận thư - Phường/Xã": student.mailAddress?.wards_communes || "",
    "Địa chỉ nhận thư - Quận/Huyện": student.mailAddress?.district || "",
    "Địa chỉ nhận thư - Tỉnh/Thành phố":
      student.mailAddress?.city_province || "",
    "Địa chỉ nhận thư - Quốc gia": student.mailAddress?.nation || "",
    Email: student.email,
    SĐT: student.phoneNumber,
    "Tình trạng": student.status?.name || "",
    "Quốc tịch": student.nationality.name,

    "Số CMND": idDocFields.cmndNumber || "",
    "Ngày cấp CMND": idDocFields.cmndIssueDate || "",
    "Nơi cấp CMND": idDocFields.cmndIssuePlace || "",
    "Ngày hết hạn CMND": idDocFields.cmndExpiryDate || "",
    "Số CCCD": idDocFields.cccdNumber || "",
    "Ngày cấp CCCD": idDocFields.cccdIssueDate || "",
    "Nơi cấp CCCD": idDocFields.cccdIssuePlace || "",
    "Ngày hết hạn CCCD": idDocFields.cccdExpiryDate || "",
    Chip: idDocFields.cccdHasChip || "",
    "Số hộ chiếu": idDocFields.passportNumber || "",
    "Ngày cấp hộ chiếu": idDocFields.passportIssueDate || "",
    "Nơi cấp hộ chiếu": idDocFields.passportIssuePlace || "",
    "Ngày hết hạn hộ chiếu": idDocFields.passportExpiryDate || "",
    "Quốc gia cấp": idDocFields.passportCountry || "",
    "Ghi chú": idDocFields.passportNotes || "",
  };
};

const parseCSV = async (buffer) => {
  return new Promise((resolve, reject) => {
    let results = [];
    const stream = Readable.from(buffer.toString());

    stream
      .pipe(csv())
      .on("data", (row) => {
        try {
          let oidCard =
            row["Số CMND"] === "" || row["Số CMND"] === null
              ? null
              : {
                  id: row["Số CMND"],
                  dateOfIssue: row["Ngày cấp CMND"],
                  placeOfIssue: row["Nơi cấp CMND"],
                  expiryOfIssue: row["Ngày hết hạn CMND"],
                };
          let nidCard =
            row["Số CCCD"] === "" || row["Số CCCD"] === null
              ? null
              : {
                  id: row["Số CCCD"],
                  dateOfIssue: row["Ngày cấp CCCD"],
                  placeOfIssue: row["Nơi cấp CCCD"],
                  expiryOfIssue: row["Ngày hết hạn CCCD"],
                  chip: row["Chip"] === "" ? row["Chip"] === "Có" : null,
                };

          let passport =
            row["Số hộ chiếu"] === "" || row["Số hộ chiếu"] === null
              ? null
              : {
                  id: row["Số hộ chiếu"],
                  dateOfIssue: row["Ngày cấp hộ chiếu"],
                  placeOfIssue: row["Nơi cấp hộ chiếu"],
                  expiryOfIssue: row["Ngày hết hạn hộ chiếu"],
                  country: row["Quốc gia cấp"],
                  note: row["Ghi chú"] || "",
                };

          // Process addresses
          // const permanentAddress = {
          //   street: row['Địa chỉ thường trú - Đường'],
          //   ward: row['Địa chỉ thường trú - Phường/Xã'],
          //   district: row['Địa chỉ thường trú - Quận/Huyện'],
          //   city: row['Địa chỉ thường trú - Tỉnh/Thành phố'],
          //   country: row['Địa chỉ thường trú - Quốc gia']
          // };

          // const temporaryAddress = row['Địa chỉ tạm trú - Đường'] ? {
          //   street: row['Địa chỉ tạm trú - Đường'],
          //   ward: row['Địa chỉ tạm trú - Phường/Xã'],
          //   district: row['Địa chỉ tạm trú - Quận/Huyện'],
          //   city: row['Địa chỉ tạm trú - Tỉnh/Thành phố'],
          //   country: row['Địa chỉ tạm trú - Quốc gia']
          // } : null;

          // const mailingAddress = {
          //   street: row['Địa chỉ nhận thư - Đường'],
          //   ward: row['Địa chỉ nhận thư - Phường/Xã'],
          //   district: row['Địa chỉ nhận thư - Quận/Huyện'],
          //   city: row['Địa chỉ nhận thư - Tỉnh/Thành phố'],
          //   country: row['Địa chỉ nhận thư - Quốc gia']
          // };

          // Map CSV row to student data
          const studentData = {
            studentId: row["MSSV"],
            fullName: row["Họ tên"],
            dateOfBirth: row["Ngày sinh"],
            gender: row["Giới tính"],
            faculty: row["Khoa"], // Will be converted to facultyId later
            course: row["Khóa"],
            program: row["Chương trình"], // Will be converted to programId later
            email: row["Email"],
            phoneNumber: row["SĐT"],
            status: row["Tình trạng"], // Will be converted to statusId later
            nationality: row["Quốc tịch"],
            // permanentAddress,
            // temporaryAddress,
            // mailingAddress,
            oidCard,
            nidCard,
            passport,
          };

          results.push(studentData);
        } catch (error) {
          console.error(`Error processing row: ${error.message}`);
        }
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};

exports.exportStudentsToCSV = async (students) => {
  try {
    const headers = [
      "MSSV",
      "Họ tên",
      "Ngày sinh",
      "Giới tính",
      "Khoa",
      "Khóa",
      "Chương trình",
      "Địa chỉ tạm trú - Đường",
      "Địa chỉ tạm trú - Phường/Xã",
      "Địa chỉ tạm trú - Quận/Huyện",
      "Địa chỉ tạm trú - Tỉnh/Thành phố",
      "Địa chỉ tạm trú - Quốc gia",
      "Địa chỉ thường trú - Đường",
      "Địa chỉ thường trú - Phường/Xã",
      "Địa chỉ thường trú - Quận/Huyện",
      "Địa chỉ thường trú - Tỉnh/Thành phố",
      "Địa chỉ thường trú - Quốc gia",
      "Địa chỉ nhận thư - Đường",
      "Địa chỉ nhận thư - Phường/Xã",
      "Địa chỉ nhận thư - Quận/Huyện",
      "Địa chỉ nhận thư - Tỉnh/Thành phố",
      "Địa chỉ nhận thư - Quốc gia",
      "Email",
      "SĐT",
      "Tình trạng",
      "Quốc tịch",
      "Số CMND",
      "Ngày cấp CMND",
      "Nơi cấp CMND",
      "Ngày hết hạn CMND",
      "Số CCCD",
      "Ngày cấp CCCD",
      "Nơi cấp CCCD",
      "Ngày hết hạn CCCD",
      "Chip",
      "Số hộ chiếu",
      "Ngày cấp hộ chiếu",
      "Nơi cấp hộ chiếu",
      "Ngày hết hạn hộ chiếu",
      "Quốc gia cấp",
      "Ghi chú",
    ];

    let csvContent = headers.join(",") + "\n";

    students.forEach((student) => {
      const row = mapStudentToCSVRow(student);
      const rowValues = headers.map((header) => {
        const value = row[header] || "";
        return `"${value.toString().replace(/"/g, '""')}"`;
      });
      csvContent += rowValues.join(",") + "\n";
    });

    return csvContent;
  } catch (error) {
    console.error(`Error exporting students to CSV: ${error.message}`);
    throw error;
  }
};

exports.importStudentsFromCSV = async (fileBuffer) => {
  const results = [];
  const studentsData = await parseCSV(fileBuffer);

  for (const studentData of studentsData) {
    const transaction = await sequelize.transaction();
    try {
      // Find or create associated models first
      const faculty = await Faculty.findOne({
        where: { name: studentData.faculty },
        transaction,
      });
      if (!faculty)
        throw new Error(`Faculty not found: ${studentData.faculty}`);

      const studentStatus = await StudentStatus.findOne({
        where: { name: studentData.status },
        transaction,
      });
      if (!studentStatus)
        throw new Error(`Status not found: ${studentData.status}`);

      const course = await Course.findOne({
        where: { courseId: studentData.course },
        transaction,
      });
      if (!course) throw new Error(`Course not found: ${studentData.course}`);

      const program = await Program.findOne({
        where: { name: studentData.program },
        transaction,
      });
      if (!program)
        throw new Error(`Program not found: ${studentData.program}`);

      const nationality = await Nationality.findOne({
        where: { name: studentData.nationality },
        transaction,
      });
      if (!nationality)
        throw new Error(`Nationality not found: ${studentData.nationality}`);

      // Prepare main student data with foreign keys
      const studentUpsertData = {
        studentId: studentData.studentId,
        fullName: studentData.fullName,
        dateOfBirth: new Date(studentData.dateOfBirth),
        gender: studentData.gender,
        email: studentData.email,
        phoneNumber: studentData.phoneNumber,
        facultyId: faculty.facultyId,
        statusId: studentStatus.statusId,
        courseId: course.courseId,
        programId: program.programId,
        nationalId: nationality.code,
      };

      // Upsert main student record
      const [student, created] = await Student.upsert(studentUpsertData, {
        transaction,
        returning: true,
        conflictFields: ["studentId"],
      });

      // Handle ID documents separately
      if (studentData.oidCard) {
        await OIDCard.upsert(
          {
            ...studentData.oidCard,
            studentId: student.studentId,
          },
          { transaction, conflictFields: ["studentId"], returning: true }
        );
      }

      if (studentData.nidCard) {
        await NIDCard.upsert(
          {
            ...studentData.nidCard,
            studentId: student.studentId,
          },
          { transaction, conflictFields: ["studentId"], returning: true }
        );
      }

      if (studentData.passport) {
        await Passport.upsert(
          {
            ...studentData.passport,
            studentId: student.studentId,
          },
          { transaction, conflictFields: ["studentId"], returning: true }
        );
      }

      await transaction.commit();

      results.push({
        studentId: student.studentId,
        action: created ? "created" : "updated",
        success: true,
      });
    } catch (error) {
      await transaction.rollback();
      results.push({
        studentId: studentData.studentId,
        action: "failed",
        error: error.message,
        success: false,
      });
      console.error(
        `Error processing student ${studentData.studentId}: ${error.message}`
      );
      console.error(error);
    }
  }

  return results;
};
