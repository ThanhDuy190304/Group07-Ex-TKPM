const express = require("express");
const programController = require("../modules/program/programController");
const router = express.Router();
router.get("/", programController.getPrograms);
router.post("/", programController.postProgram);
router.put("/:programId", programController.putProgram);

module.exports = router;
