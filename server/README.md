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
├── .env                  # Environment variables (create from .env.default)
├── .env.default          # Default environment variables template
├── src/                  # Source files
│   ├── config/           # Configuration files
│   │   └── database.js   # Database connection setup
│   ├── controller/       # API controllers
│   ├── model/            # Database models
│   │   ├── course.js     # Course model
│   │   ├── faculty.js    # Faculty model
│   │   ├── program.js    # Program model
│   │   └── student.js    # Student model
│   ├── route/            # API routes
│   │   └── studentRoute.js  # Student routes
│   ├── service/          # Business logic services
│   └── index.js          # Application entry point
└── package.json          # Dependencies and scripts
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
