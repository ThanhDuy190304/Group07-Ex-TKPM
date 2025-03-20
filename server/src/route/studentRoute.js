const express = require("express");
const router = express.Router();
const studentController = require("../modules/student/studentController");
const upload = require("../middleware/uploadMiddleware");

router.get("/statuses", studentController.getStatuses);
router.get("/", studentController.getStudents);
router.get("/search", studentController.searchStudents);
router.post("/", studentController.postStudent);
router.put("/:studentId", studentController.putStudent);
router.delete("/:studentId", studentController.deleteStudent);
router.post("/import", upload.single("file"), studentController.importStudents);
module.exports = router;
