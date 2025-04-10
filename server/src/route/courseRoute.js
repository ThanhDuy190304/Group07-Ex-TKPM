const express = require("express");
const courseController = require("../controller/course.controller");
const router = express.Router();

router.get("/", courseController.getAll);
router.post("/", courseController.create);
router.delete("/:courseCode", courseController.remove);

module.exports = router;