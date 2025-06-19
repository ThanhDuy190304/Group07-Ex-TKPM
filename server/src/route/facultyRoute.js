const express = require("express");
const router = express.Router();
const facultyController = require("../controller/faculty.controller");

/**
 * @swagger
 * components:
 *   schemas:
 *     Faculty:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         facultyCode:
 *           type: string
 *           example: "ENCO"
 *         name:
 *           type: string
 *           example: "Engineering and Computer Science"
 */

/**
 * @swagger
 * /api/faculties:
 *   get:
 *     summary: Get all faculties
 *     tags: [Faculties]
 *     responses:
 *       200:
 *         description: List of faculties
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Faculty'
 */
router.get("/", facultyController.getAll);

/**
 * @swagger
 * /api/faculties:
 *   post:
 *     summary: Create a new faculty
 *     tags: [Faculties]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Faculty'
 *     responses:
 *       201:
 *         description: Faculty created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Faculty'
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Faculty code already exists
 */
router.post("/", facultyController.create);

/**
 * @swagger
 * /api/faculties/{facultyId}:
 *   put:
 *     summary: Update a faculty
 *     tags: [Faculties]
 *     parameters:
 *       - in: path
 *         name: facultyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Faculty ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Faculty'
 *     responses:
 *       200:
 *         description: Faculty updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Faculty'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Not found
 *       409:
 *         description: Faculty code already exists
 */
router.put("/:facultyId", facultyController.update);

module.exports = router;
