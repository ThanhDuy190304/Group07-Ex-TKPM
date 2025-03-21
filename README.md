# Ex02_softwaredesign

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
    ├── data
    │   ├── in
    │   │   └── students.csv
    │   └── out
    └── src
        ├── config
        │   └── database.js
        ├── middleware
        │   └── uploadMiddleware.js
        ├── modules
        │   ├── address
        │   │   ├── mailAddressModel.js
        │   │   ├── permanentAddressModel.js
        │   │   └── temporaryResidenceAddressModel.js
        │   ├── course
        │   │   ├── courseController.js
        │   │   ├── courseModel.js
        │   │   └── courseService.js
        │   ├── faculty
        │   │   ├── facultyController.js
        │   │   ├── facultyModel.js
        │   │   └── facultyService.js
        │   ├── import
        │   │   └── fileUploadService.js
        │   ├── nationality
        │   │   └── nationalityModel.js
        │   ├── program
        │   │   ├── programController.js
        │   │   ├── programModel.js
        │   │   └── programService.js
        │   └── student
        │       ├── nidCardModel.js
        │       ├── oidCardModel.js
        │       ├── passportModel.js
        │       ├── studentController.js
        │       ├── studentModel.js
        │       ├── studentService.js
        │       └── studentStatusModel.js
        ── route
        │   ├── courseRoute.js
        │   ├── facultyRoute.js
        │   ├── programRoute.js
        │   ├── studentRoute.js
        │   └── studentRoutes.js
        │
        ├── index.js        
        └── logger.js

25 directories, 63 files
```

## Hướng dẫn cài đặt và chạy chương trình
Cài đặt Node.js
Mở cửa sổ Terminal

1. **Cài đặt và chạy server**

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

2. **Cài đặt và Chạy client**
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
    npm run dev
    ```

## Các tính năng:

1. Cho phép đổi tên & thêm mới: khoa, tình trạng sinh viên, chương trình

Thay đổi khoa
![thay đổi khoa](image/v2_thaydoikhoa.png)

Thay đổi chương trình
![Thay đổi chương trình](image/v2_thaydoichuongtrinh.png)

Thay đổi tình trạng
![Thay đổi tình trạng](image/v2_thaydoitinhtrang.png)

2. Thêm chức năng tìm kiếm: tìm theo khoa, khoa + tên

Mở mục tìm kiếm nâng cao:
![tim_kiem_nang_cao](image/v2_tim_kiem_nang_cao.png)

Chọn khoa
![chon_khoa](image/v2_chon_khoa.png)

Chọn khóa học
![chon_khoa_hoc](image/v2_chon_khoa_hoc.png)

Chọn chương trình
![chọn chương trình](image/v2_chon_chuong_trinh.png)

Kết quả
![Kết quả](image/v2_ketqua_timkiem.png)

3. Export dữ liệu bằng file json/xslx

Export bằng file json:
![export_file_json](image/v2_download_json.png)

Export bằng file xslx
![export_file_xslx](image/v2_download_xslx.png)

4. Thêm logging mechanism để troubleshooting production issue & audit purposes

![logger](image/v2_logger.png)



## Phiên bản 
```bash
v2.0
```