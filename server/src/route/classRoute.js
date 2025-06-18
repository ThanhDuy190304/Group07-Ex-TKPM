const express = require("express");
const router = express.Router();
const classController = require("../controller/class.controller");

/**
 * @swagger
 * components:
 *   schemas:
 *     Class:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         classCode:
 *           type: string
 *           example: "21_CQ1"
 *         courseCode:
 *           type: string
 *           example: "FRA101"
 *         academicYear:
 *           type: integer
 *           example: 2023
 *         semester:
 *           type: string
 *           enum: ["Kỳ 1", "Kỳ 2", "Kỳ 3"]
 *           example: "Kỳ 2"
 *         instructor:
 *           type: string
 *           example: "Nguyễn Văn A"
 *         maxStudents:
 *           type: integer
 *           example: 80
 *         room:
 *           type: string
 *           example: "A101"
 *         schedule:
 *           type: string
 *           example: "Thứ 2, 3, 4"
 *     ClassRegistration:
 *       type: object
 *       properties:
 *         studentCode:
 *           type: string
 *           example: "B20DCCN001"
 *         classCode:
 *           type: string
 *           example: "21_CQ1"
 *         grade:
 *           type: number
 *           format: float
 *           example: 8.5
 *         isPass:
 *           type: boolean
 *           example: true
 *         note:
 *           type: string
 *           example: "Passed with distinction"
 *     ClassRegistrationPeriod:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         startDateTime:
 *           type: string
 *           format: date-time
 *           example: "2023-08-01T08:00:00Z"
 *         endDateTime:
 *           type: string
 *           format: date-time
 *           example: "2023-08-10T17:00:00Z"
 *         isActive:
 *           type: boolean
 *           example: true
 *         semester:
 *           type: string
 *           enum: ["Kỳ 1", "Kỳ 2", "Kỳ 3"]
 *           example: "Kỳ 2"
 *         academicYear:
 *           type: integer
 *           example: 2023
 */

/**
 * @swagger
 * /api/classes/class-registration-periods:
 *   get:
 *     summary: Get all class registration periods
 *     tags: [Classes]
 *     responses:
 *       200:
 *         description: List of class registration periods
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ClassRegistrationPeriod'
 */
router.get(
  "/class-registration-periods",
  classController.getClassRegistrationPeriods
);

/**
 * @swagger
 * /api/classes/class-registration-periods:
 *   post:
 *     summary: Create a new class registration period
 *     tags: [Classes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClassRegistrationPeriod'
 *     responses:
 *       204:
 *         description: Class registration period created successfully
 *       400:
 *         description: Invalid input
 */
router.post(
  "/class-registration-periods",
  classController.createClassRegistrationPeriod
);

/**
 * @swagger
 * /api/classes/class-registration-periods/{id}:
 *   put:
 *     summary: Update a class registration period
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Class registration period ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClassRegistrationPeriod'
 *     responses:
 *       204:
 *         description: Class registration period updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Not found
 */
router.put(
  "/class-registration-periods/:id",
  classController.updateClassRegistrationPeriod
);

/**
 * @swagger
 * /api/classes/class-registrations/{classCode}:
 *   get:
 *     summary: Get class registration details by class code
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: classCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Class code
 *     responses:
 *       200:
 *         description: Class registration details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     class:
 *                       $ref: '#/components/schemas/Class'
 *                     registrations:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ClassRegistration'
 *       404:
 *         description: Class not found
 */
router.get(
  "/class-registrations/:classCode",
  classController.getDetailByClassCode
);

/**
 * @swagger
 * /api/classes:
 *   get:
 *     summary: Get all classes
 *     tags: [Classes]
 *     responses:
 *       200:
 *         description: List of classes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Class'
 */
router.get("/", classController.getAll);

/**
 * @swagger
 * /api/classes/allocate/{classCode}/{studentCode}:
 *   post:
 *     summary: Allocate a student to a class
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: classCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Class code
 *       - in: path
 *         name: studentCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Student code
 *     responses:
 *       204:
 *         description: Student allocated to class successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Not found
 */
router.post(
  "/allocate/:classCode/:studentCode",
  classController.allocateStudent
);

/**
 * @swagger
 * /api/classes/cancel/{classId}/{studentId}:
 *   delete:
 *     summary: Cancel a student's registration in a class
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *         description: Class ID
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student registration cancelled successfully
 *       404:
 *         description: Not found
 */
router.delete(
  "/cancel/:classId/:studentId",
  classController.cancelStudentRegistration
);

/**
 * @swagger
 * /api/classes:
 *   post:
 *     summary: Create a new class
 *     tags: [Classes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Class'
 *     responses:
 *       201:
 *         description: Class created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Class'
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Class code already exists
 */
router.post("/", classController.create);

module.exports = router;
