## Frontend
```bash
📁 Frontend Root/
├── .env, .gitignore, index.html, vite.config.js, ...
├── 📁 fonts/                     # Font chữ
├── 📁 src/
│   ├── App.jsx, main.jsx
│   ├── 📁 api/                  # Gọi API cho các thực thể
│   ├── 📁 components/           # UI components (button, layout, select, PDF)
│   ├── 📁 config/               # Cấu hình (axios, i18n)
│   ├── 📁 context/              # React Context API
│   ├── 📁 hooks/                # Custom React hooks
│   ├── 📁 locales/              # Song ngữ (vi/en)
│   ├── 📁 pages/                # Các trang chính
│   ├── 📁 public/               # Tài nguyên công khai (ảnh, logo)
│   ├── 📁 styles/               # CSS toàn cục
│   ├── 📁 types/                # Kiểu TypeScript cho dữ liệu
│   └── 📁 utils/                # Hàm tiện ích

```

## Backend

```bash
📁 Backend Root/
├── .env, package.json, README.md, ...
├── 📁 data/in/                  # File dữ liệu đầu vào (CSV)
├── 📁 src/
│   ├── index.js, logger.js
│   ├── 📁 businessRules/        # Luật nghiệp vụ
│   ├── 📁 config/               # Cấu hình DB 
│   ├── 📁 controller/           # Xử lý request
│   ├── 📁 middleware/           # Middleware (error, upload)
│   ├── 📁 models/               # Sequelize models
│   ├── 📁 route/                # Router cho từng thực thể
│   ├── 📁 service/              # Xử lý logic nghiệp vụ
│   ├── 📁 tests/                # Unit & Integration test
│   └── 📁 util/                 # Helper và xử lý lỗi

```