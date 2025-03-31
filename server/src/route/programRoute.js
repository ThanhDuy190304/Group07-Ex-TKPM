const express = require("express");
const programController = require("../modules/program/programController");
const programController1 = require("../controller/program.controller");
const router = express.Router();

router.get("/", programController.getPrograms);
router.post("/", programController.postProgram);
router.put("/:programId", programController.putProgram);

router.get("/v1", programController1.getAll);
router.post("/v1", programController1.create);
router.put("/v1/:programId", programController1.update);

module.exports = router;
