const express = require("express");
const sequelize = require("./config/db");
const initModels = require("./models/init-models");
const dotenv = require("dotenv");
const cors = require("cors");
const errorHandler = require("./middleware/error_handler");
const swagger = require("./config/swagger");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use("/api-docs", swagger.serve, swagger.setup);

app.use("/api/students", require("./route/studentRoute"));
app.use("/api/faculties", require("./route/facultyRoute"));
app.use("/api/programs", require("./route/programRoute"));
app.use("/api/classes", require("./route/classRoute"));
app.use("/api/enum", require("./route/enumRoute"));
app.use("/api/courses", require("./route/courseRoute"));

app.use(errorHandler);

// Chỉ kết nối database, KHÔNG đồng bộ
async function startServer() {
  try {
    // Chỉ xác thực kết nối, không sync
    await sequelize.authenticate();
    console.log("✅ Đã kết nối với database thành công");

    const models = initModels(sequelize);
    console.log("✅ Models đã được khởi tạo");

    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Lỗi kết nối:", error.message);
    process.exit(1); // Thoát nếu kết nối thất bại
  }
}

// Khởi động server
startServer();
