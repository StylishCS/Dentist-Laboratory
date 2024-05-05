const { Order } = require("../models/Order");
const { User } = require("../models/User");
const { genUIDOrder } = require("../utils/genUIDOrder");

async function createOrderController(req, res) {
  try {
    const user = await User.findById(req.userId).populate("labId");
    if (!user.labId._id) {
      return res.status(400).json("Doctor Not Registered On A Lab");
    }
    const order = new Order({
      UID: await genUIDOrder(Order),
      patientName: req.body.patientName,
      age: req.body.age,
      teethNo: req.body.teethNo,
      sex: req.body.sex,
      color: req.body.color,
      type: req.body.type,
      description: req.body.description,
      voiceNote: `http://127.0.0.1:3000/${req.files[0].filename}`,
      price: req.body.teethNo * user.labContract[req.body.type],
      paid: 0,
      lab_id: user.labId._id,
      doc_id: user._id,
      status: user.labId.publicDelivery ? "DocReady" : "End",
    });
    await order.save();
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function getOrdersController(req, res) {
  try {
    const orders = await Order.find({ doc_id: req.userId });
    if (!orders) {
      return res.status(404).json("No Orders Found");
    }
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function getProfitsController(req, res) {
  try {
    const orders = await Order.find({ doc_id: req.userId, status: "End" });
    if (!orders[0]) {
      return res.status(404).json("No Orders Available");
    }
    let orderQuantity = orders.length;
    const result = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalPrice: { $sum: "$price" },
          totalPaid: { $sum: "$paid" },
        },
      },
    ]);
    return res.status(200).json({
      orders: orderQuantity,
      totalPrice: result[0].totalPrice,
      totalPaid: result[0].totalPaid,
    });
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}
module.exports = {
  createOrderController,
  getOrdersController,
  getProfitsController,
};
