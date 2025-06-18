const express = require("express");
const programController = require("../controller/program.controller");
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Program:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         programCode:
 *           type: string
 *           example: "CSE"
 *         name:
 *           type: string
 *           example: "Computer Science and Engineering"
 */

/**
 * @swagger
 * /api/programs:
 *   get:
 *     summary: Get all programs
 *     tags: [Programs]
 *     responses:
 *       200:
 *         description: List of programs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Program'
 */
router.get("/", programController.getAll);

/**
 * @swagger
 * /api/programs:
 *   post:
 *     summary: Create a new program
 *     tags: [Programs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Program'
 *     responses:
 *       201:
 *         description: Program created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Program'
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Program code already exists
 */
router.post("/", programController.create);

/**
 * @swagger
 * /api/programs/{programId}:
 *   put:
 *     summary: Update a program
 *     tags: [Programs]
 *     parameters:
 *       - in: path
 *         name: programId
 *         required: true
 *         schema:
 *           type: string
 *         description: Program ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Program'
 *     responses:
 *       200:
 *         description: Program updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Program'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Not found
 *       409:
 *         description: Program code already exists
 */
router.put("/:programId", programController.update);

module.exports = router;
