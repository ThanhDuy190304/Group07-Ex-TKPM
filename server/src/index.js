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

const Nationality = require("./modules/nationality/nationalityModel");




// Fake data function
async function seedStudents() {
    const courses = ["K2020", "K2021", "K2022", "K2023"];
    const faculties = ["LAW", "JPN", "ENCO", "FRA"];
    const programs = ["CQ", "TT", "CLC"];

    const statuses = await StudentStatus.findAll();
    const nationalities = await Nationality.findAll();


    for (let i = 0; i < 50; i++) {
        const fullName = faker.person.fullName();
        const dateOfBirth = faker.date.birthdate({ min: 18, max: 25, mode: "age" });
        const gender = faker.helpers.arrayElement(["Nam", "Nữ", "Khác"]);
        const email = faker.internet.email({ firstName: fullName.replace(/\s+/g, "").toLowerCase() });
        const phoneNumber = faker.string.numeric(10);
        const statusId = faker.helpers.arrayElement(statuses).statusId;
        const nationalityId = faker.helpers.arrayElement(nationalities).nationalityId;

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
            nationalityId: nationalityId,
        });

    }
}

// Khởi tạo database
sequelize
    .sync({ force: true }) // Xóa & tạo lại database khi chạy server
    .then(async () => {
        console.log("✅ Database synced");

        await Faculty.bulkCreate([
            { facultyId: "LAW", name: "Luật" },
            { facultyId: "ENCO", name: "Tiếng Anh thương mại" },
            { facultyId: "JPN", name: "Tiếng Nhật" },
            { facultyId: "FRA", name: "Tiếng Pháp" },
        ]);

        await Course.bulkCreate([
            { courseId: "K2020", startYear: 2020 },
            { courseId: "K2021", startYear: 2021 },
            { courseId: "K2022", startYear: 2022 },
            { courseId: "K2023", startYear: 2023 },
        ]);

        await Program.bulkCreate([
            { programId: "CQ", name: "Chính quy" },
            { programId: "TT", name: "Tiên tiến" },
            { programId: "CLC", name: "Chất lượng cao" },
        ]);

        await StudentStatus.bulkCreate([
            { statusId: "DANGHOC", name: "Đang học" },
            { statusId: "TOTNGHIEP", name: "Đã tốt nghiệp" },
            { statusId: "THOIHOC", name: "Đã thôi học" },
            { statusId: "TAMDUNG", name: "Tạm dừng học" },
        ]);

        await Nationality.bulkCreate([
            { name: "Vietnam", nationalityId: "VN" },
            { name: "USA", nationalityId: "US" },
            { name: "France", nationalityId: "FR" },
            { name: "Japan", nationalityId: "JP" },
        ]);

        console.log("✅ Database seeded");

        console.log("🔄 Seeding students...");
        await seedStudents();

        app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
    })
    .catch((err) => console.error("❌ Unable to sync database:", err));
