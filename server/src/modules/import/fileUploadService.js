const xlsx = require("xlsx");
const csv = require("csv-parser");
const Student = require("../student/studentModel");
const PermanentAddress = require("../address/permanentAddressModel");
const MailAddress = require("../address/mailAddressModel");
const TemporaryResidenceAddress = require("../address/temporaryResidenceAddressModel");
const OIDCard = require("../student/oidCardModel");
const NIDCard = require("../student/nidCardModel");
const Passport = require("../student/passportModel");
const Nationality = require("../nationality/nationalityModel");

const { Readable } = require("stream");
const { where } = require("sequelize");

exports.processFile = async (file) => {
  const students = await parseCSV(file.buffer);
  return upsertStudents(students);
};

// 📝 Parse CSV file
function parseCSV(buffer) {
  return new Promise((resolve, reject) => {
    const students = [];
    const stream = Readable.from(buffer.toString());

    stream
      .pipe(csv({ separator: "," })) // Use comma as separator
      .on("data", (row) => students.push(row))
      .on("end", () => resolve(students))
      .on("error", (err) => reject(err));
  });
}

// 🛠️ Update students in the database
async function upsertStudents(students) {
  for (const row of students) {

    const filter = { mssv: row["MSSV"] };
    const update = {
      fullName: row["Họ tên"],
      dateOfBirth: row["Ngày sinh"],
      gender: row["Giới tính"],
      // faculty: row["Khoa"],
      // batch: row["Khóa"],
      // program: row["Chương trình"],
      temporaryResidenceAddress: {
        street: row["Địa chỉ tạm trú - Đường"],
        ward_communes: row["Địa chỉ tạm trú - Phường/Xã"],
        district: row["Địa chỉ tạm trú - Quận/Huyện"],
        city_province: row["Địa chỉ tạm trú - Tỉnh/Thành phố"],
        nation: row["Địa chỉ tạm trú - Quốc gia"],
      },
      permanentAddress: {
        street: row["Địa chỉ thường trú - Đường"],
        ward_communes: row["Địa chỉ thường trú - Phường/Xã"],
        district: row["Địa chỉ thường trú - Quận/Huyện"],
        city_province: row["Địa chỉ thường trú - Tỉnh/Thành phố"],
        nation: row["Địa chỉ thường trú - Quốc gia"],
      },
      mailAddress: {
        street: row["Địa chỉ nhận thư - Đường"],
        ward_communes: row["Địa chỉ nhận thư - Phường/Xã"],
        district: row["Địa chỉ nhận thư - Quận/Huyện"],
        city_province: row["Địa chỉ nhận thư - Tỉnh/Thành phố"],
        nation: row["Địa chỉ nhận thư - Quốc gia"],
      },
      email: row["Email"],
      phone: row["SĐT"],
      status: row["Tình trạng"],
      Nationality: {
        name: row["Quốc tịch"],
      },
      // identification: {
      //   nid: row["Số CMND"],
      //   nidIssuedDate: row["Ngày cấp CMND"],
      //   nidIssuedPlace: row["Nơi cấp CMND"],
      //   nidExpiryDate: row["Ngày hết hạn CMND"],
      //   oid: row["Số CCCD"],
      //   oidIssuedDate: row["Ngày cấp CCCD"],
      //   oidIssuedPlace: row["Nơi cấp CCCD"],
      //   oidExpiryDate: row["Ngày hết hạn CCCD"],
      //   chip: row["Chip"],
      //   passport: row["Số hộ chiếu"],
      //   passportIssuedDate: row["Ngày cấp hộ chiếu"],
      //   passportIssuedPlace: row["Nơi cấp hộ chiếu"],
      //   passportExpiryDate: row["Ngày hết hạn hộ chiếu"],
      //   passportCountry: row["Quốc gia cấp"],
      // },
      // note: row["Ghi chú"],
    };

    const student = await Student.findOne({
      where: { studentId: row["MSSV"] },
      include: [
        {
          model: NIDCard,
          attributes: [
            "id",
            "placeOfIssue",
            "dateOfIssue",
            "expiryOfIssue",
            "chip",
          ],
        },
        {
          model: OIDCard,
          attributes: ["id", "placeOfIssue", "dateOfIssue", "expiryOfIssue"],
        },
        {
          model: Passport,
          attributes: [
            "id",
            "dateOfIssue",
            "placeOfIssue",
            "expiryOfIssue",
            "country",
            "note",
          ],
        },
        {
          model: PermanentAddress,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: TemporaryResidenceAddress,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: MailAddress,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: Nationality,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
    }).then(function (obj) {
      if (obj) {
        return obj.update(update);
      }

      return Model.create(update);
    }).catch(error => {
      throw error.message;
    });

    // student.update(update, {});
  }
}

async function upsertAddress(Model, address) {
  if (!address) return null;

  const [record] = await Model.upsert({ ...address }, { returning: true });
  return record.id;
}

async function upsertIdentity(Model, studentId, data) {
  if (!data.id) return;

  await Model.upsert({
    studentId,
    ...data,
  });
}
