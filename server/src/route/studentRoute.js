const express = require("express");
const router = express.Router();
const studentController = require("../controller/student.controller");
const upload = require("../middleware/uploadMiddleware");

/**
 * @swagger
 * tags:
 *   - name: Students
 *     description: Student management endpoints
 * components:
 *   schemas:
 *     IdentityDocument:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [CCCD, CMND]
 *         number:
 *           type: string
 *         issueDate:
 *           type: string
 *           format: date
 *         issuePlace:
 *           type: string
 *     Student:
 *       type: object
 *       required:
 *         - studentCode
 *         - fullName
 *         - email
 *         - programCode
 *         - facultyCode
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         studentCode:
 *           type: string
 *         fullName:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phoneNumber:
 *           type: string
 *         programCode:
 *           type: string
 *         facultyCode:
 *           type: string
 *         cohortYear:
 *           type: string
 *         status:
 *           type: string
 *           enum: [STUDYING, RESERVED, SUSPENDED, DROPPED_OUT, GRADUATED]
 *         identityDocuments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/IdentityDocument'
 *
 * /api/students:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     parameters:
 *       - in: query
 *         name: studentCode
 *         schema:
 *           type: string
 *         description: Filter by student code (exact match)
 *       - in: query
 *         name: fullName
 *         schema:
 *           type: string
 *         description: Filter by student name (partial match)
 *       - in: query
 *         name: facultyCode
 *         schema:
 *           type: string
 *         description: Filter by faculty code
 *       - in: query
 *         name: cohortYear
 *         schema:
 *           type: string
 *         description: Filter by cohort year
 *       - in: query
 *         name: programCode
 *         schema:
 *           type: string
 *         description: Filter by program code
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order by student code
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of records per page
 *     responses:
 *       200:
 *         description: List of students
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     students:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Student'
 *                     total:
 *                       type: integer
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       201:
 *         description: Student created successfully
 *       400:
 *         description: Invalid input
 *
 * /api/students/{studentId}:
 *   get:
 *     summary: Get a student by ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         schema:
 *           type: string
 *         required: true
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Student not found
 *   put:
 *     summary: Update a student
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Student's ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: Student updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Student not found
 *   delete:
 *     summary: Delete a student
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Student's ID
 *     responses:
 *       204:
 *         description: Student deleted successfully
 *       404:
 *         description: Student not found
 */
router.get(
  "/study-results/:studentCode",
  studentController.getStudyResultOfStudent
);
router.get("/", studentController.getAllStudents);
router.post("/", studentController.create);
router.put("/:studentId", studentController.update);

router.delete("/delete-many", studentController.removeStudents);

router.delete("/:studentId", studentController.remove);
router.post("/import", upload.single("file"), studentController.importFile);

module.exports = router;
