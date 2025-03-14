# Ex01_softwaredesign

## Cấu trúc source code

```
project-root
├── client
│   ├── .env
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── vite.config.js
│   ├── index.html
│   ├── README.md
│   ├── directory_tree.txt
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   │   └── vite.svg
│   └── src
│       ├── api
│       │   ├── useCourses.js
│       │   ├── useFalcuties.js
│       │   ├── usePrograms.js
│       │   └── useStudents.js
│       ├── assets
│       │   └── react.svg
│       ├── components
│       │   └── sidebar.jsx
│       ├── pages
│       │   └── student.jsx
│       ├── utils
│       │   ├── axios.js
│       │   ├── ErrorContext.jsx
│       │   └── validators.js
│       ├── App.css
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
└── server
    ├── .env
    ├── .env.default
    ├── .gitignore
    ├── README.md
    ├── directory_tree.txt
    ├── package-lock.json
    ├── package.json
    └── src
        ├── config
        │   └── database.js
        ├── modules
        │   ├── course
        │   │   ├── courseController.js
        │   │   ├── courseModel.js
        │   │   └── courseService.js
        │   ├── faculty
        │   │   ├── facultyController.js
        │   │   ├── facultyModel.js
        │   │   └── facultyService.js
        │   ├── program
        │   │   ├── programController.js
        │   │   ├── programModel.js
        │   │   └── programService.js
        │   └── student
        │       ├── studentController.js
        │       ├── studentModel.js
        │       └── studentService.js
        ├── route
        │   ├── courseRoute.js
        │   ├── facultyRoute.js
        │   ├── programRoute.js
        │   ├── studentRoute.js
        │   └── studentRoutes.js
        └── index.js

17 directories, 50 files
```

## Hướng dẫn cài đặt chạy chương trình

Mở cửa sổ Terminal

1. **Cài đặt và Chạy client**
- Xuất phát từ thư mục ngoài cùng, nếu chưa thì gõ lệnh: 
```bash
cd ..
```
- Vào thư mục client:
```bash
cd client
```

2. **Cài đặt các phụ thuộc**:
Trước khi chạy project, bạn cần cài đặt các phụ thuộc. Để cài đặt, mở terminal và chạy lệnh sau:

```bash
npm install
```
Sau khi cài đặt xong, bạn có thể chạy project bằng lệnh:
```bash
npm run dev
```

3. **Cài đặt và chạy server**
- Xuất phát từ thư mục ngoài cùng, nếu chưa thì gõ lệnh: 
```bash
cd ..
```
- Vào thư mục client:
```bash
cd server
```

4. **Cài đặt các phụ thuộc**
Trước khi chạy project, bạn cần cài đặt các phụ thuộc. Để cài đặt, mở terminal và chạy lệnh sau:

```bash
npm install
```
Sau khi cài đặt xong, bạn có thể chạy project bằng lệnh:
```bash
npm start
```
hoặc 
```bash
npm run dev
```

### phiên bản 
```
v1.0
```