var express = require("express");
const {
  createOrderController,
  getOrdersController,
  getProfitsController,
} = require("../controllers/doctorController");
const upload = require("../utils/uploadImage");
const isDoc = require("../middlewares/isDoc");
var router = express.Router();

router.post("/orders/add", isDoc, upload.any(), createOrderController);
router.get("/orders", isDoc, getOrdersController);

router.get("/financial", isDoc, getProfitsController);

module.exports = router;
