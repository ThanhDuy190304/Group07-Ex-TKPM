const express = require("express");
const router = express.Router();
const studentController = require("../modules/student/studentController");
const upload = require("../middleware/uploadMiddleware");

router.get("/statuses", studentController.getStatuses);
router.put("/statuses/:statusId", studentController.putStatus);
router.post("/statuses", studentController.postStatus);

router.get("/", studentController.getStudents);
router.post("/", studentController.postStudent);
router.put("/:studentId", studentController.putStudent);
router.delete("/:studentId", studentController.deleteStudent);
router.post("/import", upload.single("file"), studentController.importStudents);
module.exports = router;
