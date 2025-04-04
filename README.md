# Ex02_softwaredesign

## Cấu trúc source code

```

project-root
client
├── directory_tree.txt
├── env.d.ts
├── eslint.config.js
├── index.html
├── node_modules
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.json
└── vite.config.js
└── src
    ├── api
    ├── App.jsx
    ├── components
    ├── config
    ├── context
    ├── data
    ├── hooks
    ├── main.jsx
    ├── pages
    ├── styles
    ├── types
    └── utils
server
├── data
├── directory_tree.txt
├── node_modules
├── package-lock.json
├── package.json
├── README.md
├── sequelize-auto.config.json
└── src
    ├── config
    ├── controller
    ├── index.js
    ├── logger.js
    ├── middleware
    ├── models
    ├── route
    ├── service
    └── util
```

## Hướng dẫn cài đặt và chạy chương trình
Cài đặt Node.js
Mở cửa sổ Terminal

1. **Cài đặt và chạy server**

    Di chuyển vào thư mục server
    ```bash
    cd server
    ```
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

## Chứng minh các tính năng: file thư mục image

## Phiên bản 
```bash
v4.0
```