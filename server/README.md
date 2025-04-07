# Student Management System

## Overview

A simple student management system built with Node.js, Express, and PostgreSQL. This system manages students, faculties, courses, and programs in an educational institution.

## Prerequisites

- Node.js (v14 or higher)
- npm
- PostgreSQL (running instance)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.default .env
   ```
   Then edit the `.env` file with your PostgreSQL credentials and other configuration details. We suggest you using our parameters for dev purpose, this database has been ready for testing.
   You can skip the next `Database Setup` section.

## Database Setup

This application uses PostgreSQL. Make sure you have a PostgreSQL server running and create a database named `student_db` (or update the name in your `.env` file).

```bash
# PostgreSQL command to create database
createdb student_db
```

## Running the Application

Start the application with:

```bash
npm start
```

The application will:

1. Connect to the PostgreSQL database
2. Sync the database models (WARNING: `force: true` will drop existing tables)
3. Seed initial data for Faculties, Courses, and Programs
4. Start the server on the configured port (default: 3000)

You can access the API at http://localhost:3000

## API Endpoints

The application includes the following API routes:

- Student routes: `/api/student`
  - Additional endpoints can be found in `src/route/studentRoute.js`
- Faculty routes: `/api/faculty`
  - Additional endpoints can be found in `src/route/facultyRoute.js`
- Program routes: `/api/program`
  - Additional endpoints can be found in `src/route/programRoute.js`
- Enum routes: `/api/enum`
  - Additional endpoints can be found in `src/route/enumRoute.js`

## Project Structure

```
.
├── .env.default
├── .gitignore
├── README.md
├── data
│   ├── in
│   │   └── students (1).csv
│   └── out
├── directory_tree.txt
├── package-lock.json
├── package.json
├── sequelize-auto.config.json
└── src
    ├── config
    │   ├── config.js
    │   ├── db.js
    │   └── validatorConfig.js
    ├── controller
    │   ├── enum.controller.js
    │   ├── faculty.controller.js
    │   ├── program.controller.js
    │   └── student.controller.js
    ├── index.js
    ├── logger.js
    ├── middleware
    │   ├── error_handler.js
    │   └── uploadMiddleware.js
    ├── models
    │   ├── class_registrations.js
    │   ├── classes.js
    │   ├── courses.js
    │   ├── faculties.js
    │   ├── identity_documents.js
    │   ├── init-models.js
    │   ├── programs.js
    │   └── students.js
    ├── modules
    │   └── files
    │       └── excel
    ├── route
    │   ├── enumRoute.js
    │   ├── facultyRoute.js
    │   ├── programRoute.js
    │   └── studentRoute.js
    ├── service
    │   ├── base.service.js
    │   ├── csv.service.js
    │   ├── enum.service.js
    │   ├── faculty.service.js
    │   ├── program.service.js
    │   └── student.service.js
    └── util
        ├── errors.js
        └── validator.js
```

## Available Models

The system includes the following models:

- **Faculty**: Academic departments (LAW, ENCO, JPN, FRA)
- **Course**: Courses operated by university. (Tiếng Nhật căn bản, Văn hóa Pháp, Luật hình sự v.v...)
- **Class**: Separated classes of each course (21_CQ1, 22_2...)
- **Program**: Education programs (CQ, TT, CLC)
- **Identity Document**: Student student ID document (CCCD, CMND, Passport)
- **Class Registration**: Student details per class, including registration info, grades,...
- **Student**: Student information (linked to faculty, identity documents, class registration, and program)

## Development Notes

- The application is configured to reset the database on startup (`force: true` in sequelize.sync). For production, you should change this to `false` to avoid data loss.
- The application automatically seeds initial data for faculties, courses, and programs.

## License

[MIT License]
