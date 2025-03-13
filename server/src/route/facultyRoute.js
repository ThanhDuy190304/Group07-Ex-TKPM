const express = require("express");
const router = express.Router();
const facultyController = require("../modules/faculty/facultyController");

router.get("/", facultyController.getFaculties);

module.exports = router;
