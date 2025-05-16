const express = require("express");
const router = express.Router();
const classController = require("../controller/class.controller");

// Route to create a new class
router.post("/", classController.create);
router.post("/allocate/:classId/:studentId", classController.allocateStudent);
router.post("/cancel/:classId/:studentId", classController.cancelStudentRegistration);

module.exports = router;
