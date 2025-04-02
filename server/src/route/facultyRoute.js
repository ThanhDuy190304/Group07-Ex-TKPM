const express = require("express");
const router = express.Router();
const facultyController = require("../controller/faculty.controller");


router.get("/", facultyController.getAll);
router.post("/", facultyController.create);
router.put("/:facultyId", facultyController.update);
module.exports = router;
