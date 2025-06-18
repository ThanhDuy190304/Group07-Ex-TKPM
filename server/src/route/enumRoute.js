const express = require("express");
const EnumController = require("../controller/enum.controller");

const router = express.Router();

/**
 * @swagger
 * /api/enums/student-status:
 *   get:
 *     summary: Get all student status types
 *     tags: [Enums]
 *     responses:
 *       200:
 *         description: List of student status types
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                     enum: ["Đang học", "Đã thôi học", "Tạm dừng học", "Bảo lưu", "Tốt nghiệp", "Đình chỉ"]
 */
router.get("/student-status", EnumController.getStudentStatusTypes);

/**
 * @swagger
 * /api/enums/semesters:
 *   get:
 *     summary: Get all semester types
 *     tags: [Enums]
 *     responses:
 *       200:
 *         description: List of semester types
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                     enum: ["Kỳ 1", "Kỳ 2", "Kỳ 3"]
 */
router.get("/semesters", EnumController.getSemesterTypes);

/**
 * @swagger
 * /api/enums/genders:
 *   get:
 *     summary: Get all gender types
 *     tags: [Enums]
 *     responses:
 *       200:
 *         description: List of gender types
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                     enum: ["Khác", "Nam", "Nữ"]
 */
router.get("/genders", EnumController.getGenderTypes);

/**
 * @swagger
 * /api/enums/identity-types:
 *   get:
 *     summary: Get all identity document types
 *     tags: [Enums]
 *     responses:
 *       200:
 *         description: List of identity document types
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                     enum: ["CCCD", "CMND"]
 */
router.get("/identity-types", EnumController.getIdentityTypes);

module.exports = router;
