var express = require("express");
const {
  createOrderController,
  getOrdersController,
  getProfitsController,
  editOrderController,
  getOrderByIdController,
} = require("../controllers/doctorController");
const upload = require("../utils/uploadImage");
const isDoc = require("../middlewares/isDoc");
var router = express.Router();

router.post("/orders/add", isDoc, upload.any(), createOrderController);
router.put("/orders/update/:id", isDoc, upload.any(), editOrderController);

router.get("/orders", isDoc, getOrdersController);
router.get("/orders/:id", isDoc, getOrderByIdController);

router.get("/financial", isDoc, getProfitsController);

module.exports = router;
