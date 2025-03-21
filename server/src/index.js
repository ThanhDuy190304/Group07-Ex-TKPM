const { faker } = require("@faker-js/faker");
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use("/api/student", require("./route/studentRoute"));
app.use("/api/faculty", require("./route/facultyRoute"));
app.use("/api/course", require("./route/courseRoute"));
app.use("/api/program", require("./route/programRoute"));

// Import models
const Student = require("./modules/student/studentModel");
const Faculty = require("./modules/faculty/facultyModel");
const Course = require("./modules/course/courseModel");
const Program = require("./modules/program/programModel");
const StudentStatus = require("./modules/student/studentStatusModel");
const NIDCard = require("./modules/student/nidCardModel");
const OIDCard = require("./modules/student/oidCardModel");
const Passport = require("./modules/student/passportModel");

const PermanentAddress = require("./modules/address/permanentAddressModel");
const TemporaryResidenceAddress = require("./modules/address/temporaryResidenceAddressModel");
const MailAddress = require("./modules/address/mailAddressModel");
const Nationality = require("./modules/nationality/nationalityModel");


const NUM_ADDRESSES = 50; // Số lượng địa chỉ tạo trước

async function seedAddresses() {
    let permanentAddresses = [];
    let temporaryAddresses = [];
    let mailAddresses = [];

    for (let i = 0; i < NUM_ADDRESSES; i++) {
        permanentAddresses.push({
            street: faker.location.streetAddress(),
            wards_communes: faker.location.city(),
            district: faker.location.city(),
            city_province: faker.location.state(),
            nation: "Vietnam",
        });

        temporaryAddresses.push({
            street: faker.location.streetAddress(),
            wards_communes: faker.location.city(),
            district: faker.location.city(),
            city_province: faker.location.state(),
            nation: "Vietnam",
        });

        mailAddresses.push({
            street: faker.location.streetAddress(),
            wards_communes: faker.location.city(),
            district: faker.location.city(),
            city_province: faker.location.state(),
            nation: "Vietnam",
        });
    }

    await PermanentAddress.bulkCreate(permanentAddresses);
    await TemporaryResidenceAddress.bulkCreate(temporaryAddresses);
    await MailAddress.bulkCreate(mailAddresses);
}


// Fake data function
async function seedStudents() {
    const courses = ["K2020", "K2021", "K2022", "K2023"];
    const faculties = [1, 2, 3, 4];
    const programs = [1, 2, 3];

    const statuses = await StudentStatus.findAll();
    const nationalities = await Nationality.findAll();
    const permanentAddresses = await PermanentAddress.findAll();
    const temporaryAddresses = await TemporaryResidenceAddress.findAll();
    const mailAddresses = await MailAddress.findAll();

    for (let i = 0; i < 50; i++) {
        const fullName = faker.person.fullName();
        const dateOfBirth = faker.date.birthdate({ min: 18, max: 25, mode: "age" });
        const gender = faker.helpers.arrayElement(["Nam", "Nữ", "Khác"]);
        const email = faker.internet.email({ firstName: fullName.replace(/\s+/g, "").toLowerCase() });
        const phoneNumber = faker.string.numeric(10);
        const statusId = faker.helpers.arrayElement(statuses).statusId;
        const nationalityId = faker.helpers.arrayElement(nationalities).code;

        // 🔄 Chọn địa chỉ ngẫu nhiên
        const permanentAddress = faker.helpers.arrayElement(permanentAddresses);
        const temporaryAddress = faker.helpers.arrayElement(temporaryAddresses);
        const mailAddress = faker.helpers.arrayElement(mailAddresses);

        // Tạo sinh viên
        const student = await Student.create({
            fullName,
            dateOfBirth,
            gender,
            email,
            phoneNumber,
            courseId: faker.helpers.arrayElement(courses),
            facultyId: faker.helpers.arrayElement(faculties),
            programId: faker.helpers.arrayElement(programs),
            statusId,
            nationalId: nationalityId,
            permanentAddressId: permanentAddress.id,
            temporaryResidenceAddressId: temporaryAddress.id,
            mailAddressId: mailAddress.id,
        });

        // Thêm CCCD
        await NIDCard.create({
            studentId: student.studentId,
            id: faker.string.numeric(12),
            dateOfIssue: faker.date.past(),
            expiryOfIssue: faker.date.future(),
            placeOfIssue: faker.location.city(),
            chip: faker.datatype.boolean(),
        });

        // Thêm CMND
        await OIDCard.create({
            id: faker.string.numeric(9),
            studentId: student.studentId,
            dateOfIssue: faker.date.past(),
            expiryOfIssue: faker.date.future(),
            placeOfIssue: faker.location.city(),
        });

        // Thêm Hộ chiếu
        await Passport.create({
            id: faker.string.alphanumeric(8).toUpperCase(),
            studentId: student.studentId,
            dateOfIssue: faker.date.past(),
            expiryOfIssue: faker.date.future(),
            placeOfIssue: faker.location.city(),
            country: "Vietnam",
            note: faker.lorem.sentence(),
        });
    }
}

// Khởi tạo database
sequelize
    .sync({ force: true }) // Xóa & tạo lại database khi chạy server
    .then(async () => {
        console.log("✅ Database synced");

        await Faculty.bulkCreate([
            { short_name: "LAW", name: "Luật" },
            { short_name: "ENCO", name: "Tiếng Anh thương mại" },
            { short_name: "JPN", name: "Tiếng Nhật" },
            { short_name: "FRA", name: "Tiếng Pháp" },
        ]);

        await Course.bulkCreate([
            { courseId: "K2020", startYear: 2020 },
            { courseId: "K2021", startYear: 2021 },
            { courseId: "K2022", startYear: 2022 },
            { courseId: "K2023", startYear: 2023 },
        ]);

        await Program.bulkCreate([
            { short_name: "CQ", name: "Chính quy" },
            { short_name: "TT", name: "Tiên tiến" },
            { short_name: "CLC", name: "Chất lượng cao" },
        ]);

        await StudentStatus.bulkCreate([
            { name: "Đang học" },
            { name: "Đã tốt nghiệp" },
            { name: "Đã thôi học" },
            { name: "Tạm dừng học" },
        ]);

        await Nationality.bulkCreate([
            { name: "Vietnam", code: "VN" },
            { name: "USA", code: "US" },
            { name: "France", code: "FR" },
            { name: "Japan", code: "JP" },
        ]);

        console.log("✅ Database seeded");

        console.log("🔄 Seeding students...");
        await seedAddresses();
        await seedStudents();

        app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
    })
    .catch((err) => console.error("❌ Unable to sync database:", err));
