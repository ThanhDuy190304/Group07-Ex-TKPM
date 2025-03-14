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

## Hướng dẫn cài đặt và chạy chương trình
Cài đặt Node.js
Mở cửa sổ Terminal

1. **Cài đặt và Chạy client**
    Di chuyển vào thư mục client
    ```bash
    cd client
    ```
    Cài đặt dependencies
    ```bash
    npm install
    ```
    Build project (tạo thư mục "dist")
    ```bash
    npm run build
    ```
    Chạy preview
    ```bash
    npm run preview
    ```
2. **Cài đặt và chạy server**

    Di chuyển vào thư mục server
    ```bash
    cd server
    ```
    Cấu hình .env
    ```bash
    cp .env.default .env
    ```
    Sau đó, chỉnh sửa tệp .env với thông tin đăng nhập PostgreSQL và các chi tiết cấu hình khác.
    Cài đặt dependencies
    ```bash
    npm install
    ```
    Chạy server start
    ```bash
    npm run start
    ```
## Phiên bản 
```bash
v1.0
```