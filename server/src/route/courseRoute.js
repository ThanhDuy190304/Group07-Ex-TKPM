const express = require("express");
const courseController = require("../controller/course.controller");
const router = express.Router();

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of courses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 courses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 */
router.get("/", courseController.getAll);

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseCode
 *               - name
 *               - credits
 *               - facultyCode
 *               - description
 *             properties:
 *               courseCode:
 *                 type: string
 *                 description: Unique course code
 *                 example: "CS101"
 *               name:
 *                 type: string
 *                 description: Course name
 *                 example: "Introduction to Programming"
 *               credits:
 *                 type: integer
 *                 minimum: 2
 *                 description: Number of credits (must be at least 2)
 *                 example: 3
 *               facultyCode:
 *                 type: string
 *                 description: Faculty code that the course belongs to
 *                 example: "CNTT"
 *               description:
 *                 type: string
 *                 description: Course description
 *                 example: "An introductory course to programming concepts"
 *               prerequisiteCourseCode:
 *                 type: array
 *                 description: List of prerequisite course codes (optional)
 *                 items:
 *                   type: string
 *                 example: ["CS100"]
 *     responses:
 *       201:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     course:
 *                       $ref: '#/components/schemas/Course'
 *       400:
 *         description: Validation error (missing fields or invalid credits)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields"
 *                 message_vi:
 *                   type: string
 *                   example: "Thiếu dữ liệu"
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *       404:
 *         description: Prerequisite course not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Prerequisite course(s) not found"
 *                 message_vi:
 *                   type: string
 *                   example: "Môn tiên quyết không tồn tại"
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 */
router.post("/", courseController.create);

/**
 * @swagger
 * /api/courses/{courseCode}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseCode
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.delete("/:courseCode", courseController.remove);

/**
 * @swagger
 * /api/courses/{courseCode}:
 *   put:
 *     summary: Update a course
 *     description: Update course information. Course code cannot be updated.
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Course code to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               name:
 *                 type: string
 *                 description: New course name
 *               credits:
 *                 type: integer
 *                 minimum: 2
 *                 description: Number of credits (must be at least 2)
 *               description:
 *                 type: string
 *                 description: New course description
 *               prerequisiteCourseCode:
 *                 type: array
 *                 description: Updated list of prerequisite course codes
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Course updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     course:
 *                       $ref: '#/components/schemas/Course'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No data provided for update"
 *                 message_vi:
 *                   type: string
 *                   example: "Không có dữ liệu để cập nhật"
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *       404:
 *         description: Course not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Course not found"
 *                 message_vi:
 *                   type: string
 *                   example: "Khóa học không tồn tại"
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 */
router.put("/:courseCode", courseController.update);

module.exports = router;
