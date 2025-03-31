const express = require("express");
const router = express.Router();
const facultyController = require("../modules/faculty/facultyController");
const facultyController1 = require("../controller/faculty.controller");

router.get("/", facultyController.getFaculties);
router.post("/", facultyController.postFaculty);
router.put("/:facultyId", facultyController.putFaculty);

router.get("/v1", facultyController1.getAll);
router.post("/v1", facultyController1.create);
router.put("/v1/:facultyId", facultyController1.update);
module.exports = router;
