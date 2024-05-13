const { Order } = require("../models/Order");
const { User } = require("../models/User");
const { genUIDOrder } = require("../utils/genUIDOrder");

async function createOrderController(req, res) {
  try {
    const user = await User.findById(req.userId).populate("labId");
    if (!user.labId) {
      return res.status(400).json("Doctor Not Registered On A Lab");
    }
    console.log(user.labContract);
    if (req.files[0]) {
      if (req.files[0].fieldname === "voiceNote") {
        req.body.voiceNote = `http://45.93.138.72:3000/${req.files[0].filename}`;
      }
    }
    if (req.files[1]) {
      if (req.files[1].fieldname === "screen") {
        req.body.screen = `http://45.93.138.72:3000/${req.files[1].filename}`;
      }
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
      voiceNote: req.body.voiceNote,
      screen: req.body.screen,
      price: req.body.teethNo * user.labContract[req.body.type],
      paid: 0,
      lab_id: user.labId._id,
      doc_id: user._id,
      status: user.labId.publicDelivery ? "DocReady" : "End",
    });
    await order.save();
    return res.status(200).json(order);
  } catch (error) {
    console.log(error);
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function editOrderController(req, res) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json("Order Not Found");
    }
    if (order.status == "End") {
      return res.status(400).json("Can't Order Ended Orders");
    }
    if (req.files) {
      req.body.voiceNote = `http://45.93.138.72:3000/${req.files[0].filename}`;
    }
    const user = await User.findById(req.userId);
    order.patientName = req.body.patientName
      ? req.body.patientName
      : order.patientName;
    order.age = req.body.age ? req.body.age : order.age;
    order.teethNo = req.body.teethNo ? req.body.teethNo : order.teethNo;
    order.sex = req.body.sex ? req.body.sex : order.sex;
    order.color = req.body.color ? req.body.color : order.color;
    order.type = req.body.type ? req.body.type : order.type;
    order.description = req.body.description
      ? req.body.description
      : order.description;
    order.voiceNote = req.body.voiceNote ? req.body.voiceNote : order.voiceNote;
    order.price = req.body.teethNo
      ? req.body.teethNo *
        user.labContract[req.body.type ? req.body.type : order.type]
      : order.price;
    await order.save();
    return res.status(200).json(order);
  } catch (error) {
    console.log(error);
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

async function getOrderByIdController(req, res) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json("No Orders Found");
    }
    return res.status(200).json(order);
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
  editOrderController,
  getOrderByIdController,
};
