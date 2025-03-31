const express = require("express");
const router = express.Router();

const statusController = require('../controller/status.controller');

router.get("v1", statusController.getAll);
router.put("v1/:statusId", statusController.update);
router.post("v1", statusController.create);