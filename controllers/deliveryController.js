const { Order } = require("../models/Order");
const { User } = require("../models/User");

async function getReadyOrders(req, res) {
  try {
    const orders = await Order.find({
      status: ["DocReady", "LabReady"],
    })
      .populate("doc_id")
      .populate("lab_id");
    if (!orders) {
      return res.status(404).json("No Ready Orders");
    }
    return res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function getMyOrdersController(req, res) {
  try {
    const orders = await User.findById(req.userId)
      .select("delOrders")
      .populate({
        path: "delOrders",
        populate: { path: "lab_id doc_id" },
      });
    if (!orders.delOrders[0]) {
      return res.status(404).json("No Orders Available");
    }
    return res.status(200).json(orders.delOrders);
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function markOrderDeliveredLabController(req, res) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json("Order Not Found");
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json("User Not Found");
    }
    if (order.status !== "OTW_LAB") {
      return res.status(400).json("Can't Set Order Delivered");
    }
    order.status = "Underway";
    await order.save();
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function markOrderDeliveredDocController(req, res) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json("Order Not Found");
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json("User Not Found");
    }
    if (order.status !== "OTW_DOC") {
      return res.status(400).json("Can't Set Order Delivered");
    }
    order.status = "End";
    await order.save();
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function takeOrderController(req, res) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json("Order Not Found");
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json("User Not Found");
    }
    if (order.status !== "DocReady" && order.status !== "LabReady") {
      return res.status(400).json("Order isn't ready yet");
    }
    order.status == "DocReady"
      ? (order.status = "OTW_LAB")
      : (order.status = "OTW_DOC");
    user.delOrders.push(order._id);
    await order.save();
    await user.save();
    return res.status(200).json(order);
  } catch (error) {
    console.log(error);
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}
async function getProfitsController(req, res) {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json("User Not Found");
    }
    let orderQuantity = user.delOrders.length;
    return res.status(200).json({
      orders: orderQuantity,
      totalProfit: orderQuantity * 3.5,
    });
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

module.exports = {
  getReadyOrders,
  markOrderDeliveredDocController,
  markOrderDeliveredLabController,
  takeOrderController,
  getProfitsController,
  getMyOrdersController,
};
