const express = require("express");
const router = express.Router();

const studentController = require("../controller/student.controller");

const upload = require("../middleware/uploadMiddleware");

router.get("/", studentController.getAllStudents);
router.post("/", studentController.create);
router.put("/:studentId", studentController.update);

router.delete("/delete-many", studentController.removeStudents)

router.delete("/:studentId", studentController.remove);
router.post("/import", upload.single("file"), studentController.importFile);

module.exports = router;
