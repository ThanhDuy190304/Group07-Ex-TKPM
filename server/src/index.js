const express = require("express");
const sequelize = require("./config/database");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/student", require("./route/studentRoute"));

sequelize
  .sync({ force: true })
  .then(async () => {
    console.log("Database synced");
    // Seed initial data
    const Faculty = require("./model/faculty");
    const Course = require("./model/course");
    const Program = require("./model/program");

    await Faculty.create({ short_name: "LAW", name: "Luật" });
    await Faculty.create({ short_name: "ENCO", name: "Tiếng Anh thương mại" });
    await Faculty.create({ short_name: "JPN", name: "Tiếng Nhật" });
    await Faculty.create({ short_name: "FRA", name: "Tiếng Pháp" });

    await Course.create({ courseId: "K2020", startYear: 2020 });
    await Course.create({ courseId: "K2021", startYear: 2021 });
    await Course.create({ courseId: "K2022", startYear: 2022 });
    await Course.create({ courseId: "K2023", startYear: 2023 });

    await Program.create({ programId: "CQ", name: "Chính quy" });
    await Program.create({ programId: "TT", name: "Tiên tiến" });
    await Program.create({ programId: "CLC", name: "Chất lượng cao" });

    console.log("Database seeded");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("Unable to sync database:", err));
