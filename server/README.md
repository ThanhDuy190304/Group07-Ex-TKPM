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
   Then edit the `.env` file with your PostgreSQL credentials and other configuration details.

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

## Project Structure

```
.
├── .env                                     # Environment variables (create from .env.default)
├── .env.default                             # Default environment variables template
├── .gitignore                
├── README.md
├── directory_tree.txt
├── package-lock.json
├── package.json                             # Dependencies and scripts
└── src                                      # Source files
    ├── config                               # Configuration files
    │   └── database.js                      # Database connection setup
    ├── modules
    │   ├── course                           # Course folder
    │   │   ├── courseController.js          # Course controller
    │   │   ├── courseModel.js               # Course model
    │   │   └── courseService.js             # Course service
    │   ├── faculty                          # Faculty folder
    │   │   ├── facultyController.js         # Faculty controller
    │   │   ├── facultyModel.js              # Faculty model
    │   │   └── facultyService.js            # Faculty service
    │   ├── program                          # Program folder
    │   │   ├── programController.js         # Program controller
    │   │   ├── programModel.js              # Program model
    │   │   └── programService.js            # Program service
    │   └── student                          # Student folder
    │       ├── studentController.js         # Student controller
    │       ├── studentModel.js              # Student model
    │       └── studentService.js            # Student service
    ├── route                                # Routes
    │   ├── courseRoute.js                   # Course Route
    │   ├── facultyRoute.js                  # Faculty Route
    │   ├── programRoute.js                  # Program Route
    │   ├── studentRoute.js                  # Student Route
    │   └── studentRoutes.js                 
    │        
    └── index.js                             # Application entry point

8 directories, 26 files

```

## Available Models

The system includes the following models:

- **Faculty**: Academic departments (LAW, ENCO, JPN, FRA)
- **Course**: Student cohorts by year (K2020, K2021, etc.)
- **Program**: Education programs (CQ, TT, CLC)
- **Student**: Student information (linked to faculty, course, and program)

## Development Notes

- The application is configured to reset the database on startup (`force: true` in sequelize.sync). For production, you should change this to `false` to avoid data loss.
- The application automatically seeds initial data for faculties, courses, and programs.

## License

[MIT License]
