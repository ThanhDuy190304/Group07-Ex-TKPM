const express = require("express");
const router = express.Router();
const facultyController = require("../modules/faculty/facultyController");

router.get("/", facultyController.getFaculties);
router.post("/", facultyController.postFaculty);
router.put("/:facultyId", facultyController.putFaculty);
module.exports = router;
