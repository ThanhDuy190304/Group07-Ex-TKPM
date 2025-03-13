const express = require("express");
const { body, query, validationResult } = require("express-validator");
const sequelize = require("sequelize");
const router = express.Router();
const Student = require("../modules/student/studentModel");
const Faculty = require("../modules/faculty/facultyModel");
const Course = require("../modules/course/courseModel");
const Program = require("../modules/program/programModel");

// Validation middleware
const studentValidationRules = [
    body("studentId").notEmpty().withMessage("MSSV is required"),
    body("fullName").notEmpty().withMessage("Full name is required"),
    body("dateOfBirth")
        .isISO8601()
        .withMessage("Invalid date of birth (use YYYY-MM-DD)"),
    body("gender")
        .isIn(["Nam", "Nữ", "Khác"])
        .withMessage("Gender must be Nam, Nữ, or Khác"),
    body("facultyId").notEmpty().withMessage("Faculty ID is required"),
    body("courseId").notEmpty().withMessage("Course ID is required"),
    body("programId").notEmpty().withMessage("Program ID is required"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("phoneNumber")
        .matches(/^[0-9]{10}$/)
        .withMessage("Phone number must be 10 digits"),
    body("status")
        .isIn(["Đang học", "Tốt nghiệp", "Bị đình chỉ"])
        .withMessage("Invalid status"),
];

// Middleware to check validation result
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// 1. Add a new student
router.post("/", studentValidationRules, validate, async (req, res) => {
    try {
        const { studentId, facultyId, courseId, programId } = req.body;

        // Check if studentId already exists
        const existingStudent = await Student.findByPk(studentId);
        if (existingStudent)
            return res.status(400).json({ error: "Student ID already exists" });

        // Validate referenced entities
        const faculty = await Faculty.findByPk(facultyId);
        const course = await Course.findByPk(courseId);
        const program = await Program.findByPk(programId);
        if (!faculty) return res.status(400).json({ error: "Faculty not found" });
        if (!course) return res.status(400).json({ error: "Course not found" });
        if (!program) return res.status(400).json({ error: "Program not found" });

        const student = await Student.create(req.body);
        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all students (with faculty, course, and program details)
router.get("/", async (req, res) => {
    try {
        const students = await Student.findAll({
            include: [
                { model: Faculty, attributes: ["facultyId", "name"] },
                { model: Course, attributes: ["courseId", "startYear"] },
                { model: Program, attributes: ["programId", "name"] },
            ],
        });
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Search students by fullName or studentId
router.get(
    "/search",
    [query("q").notEmpty().withMessage("Search query is required")],
    validate,
    async (req, res) => {
        try {
            const { q } = req.query;
            const students = await Student.findAll({
                where: {
                    [sequelize.Op.or]: [
                        { studentId: { [sequelize.Op.like]: `%${q}%` } },
                        { fullName: { [sequelize.Op.like]: `%${q}%` } },
                    ],
                },
                include: [
                    { model: Faculty, attributes: ["facultyId", "name"] },
                    {
                        model: Course,
                        attributes: ["courseId", "startYear"],
                    },
                    { model: Program, attributes: ["programId", "name"] },
                ],
            });
            res.status(200).json(students);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

// 3. Update a student by MSSV
router.put(
    "/:studentId",
    studentValidationRules,
    validate,
    async (req, res) => {
        try {
            const student = await Student.findByPk(req.params.studentId);
            if (!student) return res.status(404).json({ error: "Student not found" });

            const { facultyId, courseId, programId } = req.body;
            const faculty = await Faculty.findByPk(facultyId);
            const course = await Course.findByPk(courseId);
            const program = await Program.findByPk(programId);
            if (!faculty) return res.status(400).json({ error: "Faculty not found" });
            if (!course) return res.status(400).json({ error: "Course not found" });
            if (!program) return res.status(400).json({ error: "Program not found" });

            await student.update(req.body);
            res.status(200).json(student);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
);

// 2. Delete a student by MSSV
router.delete("/:studentId", async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.studentId);
        if (!student) return res.status(404).json({ error: "Student not found" });
        await student.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
