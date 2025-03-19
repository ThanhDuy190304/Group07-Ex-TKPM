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

// Fake data function
async function seedStudents() {
    const courses = ["K2020", "K2021", "K2022", "K2023"];
    const faculties = [1, 2, 3, 4];
    const programs = ["CQ", "TT", "CLC"];

    for (let i = 0; i < 1000; i++) {
        const fullName = faker.person.fullName();
        const dateOfBirth = faker.date.birthdate({ min: 18, max: 25, mode: "age" });
        const gender = faker.helpers.arrayElement(["Nam", "Nữ", "Khác"]);
        const address = faker.location.streetAddress();
        const cleanName = fullName.replace(/\s+/g, "").toLowerCase(); // Loại bỏ khoảng trắng
        const email = faker.internet.email({ firstName: cleanName });

        const phoneNumber = faker.string.numeric(10);
        const status = faker.helpers.arrayElement(["Đang học", "Đã tốt nghiệp", "Đã thôi học", "Tạm dừng học"]);

        await Student.create({
            fullName,
            dateOfBirth,
            gender,
            address,
            email,
            phoneNumber,
            courseId: faker.helpers.arrayElement(courses),
            facultyId: faker.helpers.arrayElement(faculties),
            programId: faker.helpers.arrayElement(programs),
            status,
        });
    }
}

// Khởi tạo database
sequelize
    .sync()
    .then(async () => {
        console.log("✅ Database synced");

        // Kiểm tra nếu bảng Faculty chưa có dữ liệu thì mới thêm
        const facultyCount = await Faculty.count();
        if (facultyCount === 0) {
            await Faculty.bulkCreate([
                { short_name: "LAW", name: "Luật" },
                { short_name: "ENCO", name: "Tiếng Anh thương mại" },
                { short_name: "JPN", name: "Tiếng Nhật" },
                { short_name: "FRA", name: "Tiếng Pháp" },
            ]);
        }

        // Kiểm tra nếu bảng Course chưa có dữ liệu thì mới thêm
        const courseCount = await Course.count();
        if (courseCount === 0) {
            await Course.bulkCreate([
                { courseId: "K2020", startYear: 2020 },
                { courseId: "K2021", startYear: 2021 },
                { courseId: "K2022", startYear: 2022 },
                { courseId: "K2023", startYear: 2023 },
            ]);
        }

        // Kiểm tra nếu bảng Program chưa có dữ liệu thì mới thêm
        const programCount = await Program.count();
        if (programCount === 0) {
            await Program.bulkCreate([
                { programId: "CQ", name: "Chính quy" },
                { programId: "TT", name: "Tiên tiến" },
                { programId: "CLC", name: "Chất lượng cao" },
            ]);
        }

        console.log("✅ Database seeded");

        // Kiểm tra nếu bảng Student chưa có dữ liệu thì mới seed
        const studentCount = await Student.count();
        if (studentCount === 0) {
            console.log("🔄 Seeding students...");
            await seedStudents();
        } else {
            console.log("✅ Students already exist, skipping seeding.");
        }

        app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
    })
    .catch((err) => console.error("❌ Unable to sync database:", err));


// app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
