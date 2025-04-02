const express = require("express");
const router = express.Router();

const studentController = require("../controller/student.controller");

const upload = require("../middleware/uploadMiddleware");

// router.get("/statuses", studentController.getStatuses);
// router.put("/statuses/:statusId", studentController.putStatus);
// router.post("/statuses", studentController.postStatus);


// router.get("/", studentController.getPaginatedStudents);
// router.post("/", studentController.postStudent);
// router.put("/:studentId", studentController.putStudent);
// router.delete("/:studentId", studentController.deleteStudent);
// router.post("/import", upload.single("file"), studentController.importStudents);

/** */

router.get("/", studentController.getAllStudents);
router.post("/", studentController.create);
router.put("/:studentId", studentController.update);
router.delete("/:studentId", studentController.remove);
router.post("/import", upload.single("file"), studentController.importFile);

module.exports = router;
