const express = require("express");
const router = express.Router();

const batchController1 = require("../controller/batch.controller");

router.get("/v1", batchController1.getAll);

module.exports = router;
