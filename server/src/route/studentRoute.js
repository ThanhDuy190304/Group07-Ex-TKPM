const express = require("express");
const router = express.Router();
const studentController = require("../modules/student/studentController");

const studentController1 = require("../controller/student.controller");

const upload = require("../middleware/uploadMiddleware");

router.get("/statuses", studentController.getStatuses);
router.put("/statuses/:statusId", studentController.putStatus);
router.post("/statuses", studentController.postStatus);

router.get("/export", studentController.getAllStudents);

router.get("/", studentController.getPaginatedStudents);
router.post("/", studentController.postStudent);
router.put("/:studentId", studentController.putStudent);
router.delete("/:studentId", studentController.deleteStudent);
router.post("/import", upload.single("file"), studentController.importStudents);

/** */

router.get("/export", studentController.getAllStudents);

router.get("/v1", studentController1.getAllPaginated);
router.post("/v1", studentController1.create);
router.put("/v1/:studentId", studentController1.update);
router.delete("/v1/:studentId", studentController1.remove);
router.post("/v1/import", upload.single("file"), studentController1.importFile);

module.exports = router;
