const express = require('express');
const sequelize = require('./config/db');
const initModels = require('./models/init-models');
const dotenv = require("dotenv");
const cors = require("cors");
const errorHandler = require("./middleware/error_handler");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use("/api/student", require("./route/studentRoute"));
app.use("/api/faculty", require("./route/facultyRoute"));
app.use("/api/program", require("./route/programRoute"));
app.use("/api/class", require("./route/classRoute"));
app.use("/api/enum", require("./route/enumRoute"));
app.use("/api/course", require("./route/courseRoute"));

app.use(errorHandler);


// Chỉ kết nối database, KHÔNG đồng bộ
async function startServer() {
    try {
        // Chỉ xác thực kết nối, không sync
        await sequelize.authenticate();
        console.log('✅ Đã kết nối với database thành công');

        const models = initModels(sequelize);
        console.log("✅ Models đã được khởi tạo");

        app.listen(PORT, () => {
            console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Lỗi kết nối:', error.message);
        process.exit(1); // Thoát nếu kết nối thất bại
    }
}

// Khởi động server
startServer();

