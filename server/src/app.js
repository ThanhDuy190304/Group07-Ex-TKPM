const express = require('express');
const sequelize = require('./config/db');
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(cors());
app.use("/api/student", require("./route/studentRoute"));
app.use("/api/faculty", require("./route/facultyRoute"));
app.use("/api/course", require("./route/courseRoute"));
app.use("/api/program", require("./route/programRoute"));

// Chỉ kết nối database, KHÔNG đồng bộ
async function startServer() {
    try {
        // Chỉ xác thực kết nối, không sync
        await sequelize.authenticate();
        console.log('✅ Đã kết nối với Supabase thành công');

        app.listen(PORT, () => {
            console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Lỗi kết nối Supabase:', error.message);
        process.exit(1); // Thoát nếu kết nối thất bại
    }
}

// Khởi động server
startServer();

