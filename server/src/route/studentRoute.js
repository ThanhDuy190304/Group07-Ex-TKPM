const express = require("express");
const router = express.Router();
const studentController = require("../modules/student/studentController");

router.get("/statuses", studentController.getStatuses);
router.get("/", studentController.getStudents);
router.post("/", studentController.postStudent);
router.put("/:studentId", studentController.putStudent);
router.delete("/:studentId", studentController.deleteStudent);
module.exports = router;
