const { Order } = require("../models/Order");
const { User } = require("../models/User");

async function addDocController(req, res) {
  try {
    const lab = await User.findById(req.userId);
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json("Doctor not found");
    }
    if (!lab) {
      return res.status(404).json("Lab not found");
    }
    if (lab.docsId.includes(req.params.id)) {
      return res.status(400).json("Doctor Already Added");
    }
    lab.docsId.push(req.params.id);
    user.labId = lab._id;
    await lab.save();
    await user.save();
    return res.status(200).json(lab);
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function getDoctorContractController(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json("Doctor not found");
    }
    return res.status(200).json(user.labContract);
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function updateDoctorContractController(req, res) {
  try {
    const lab = await User.findById(req.userId);
    if (!lab) {
      return res.status(404).json("Lab not found");
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json("User not found");
    }
    user.labContract = req.body.contract;
    await user.save();
    return res.status(200).json(user.labContract);
  } catch (error) {
    return res.status(200).json("INTERNAL SERVER ERROR");
  }
}

async function markOrderReadyController(req, res) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json("Order Not Found");
    }
    if (order.status == "LabReady") {
      return res.status(400).json("Order Already Ready");
    }
    if (order.status !== "Underway") {
      return res.status(400).json("Can't Set Order To Ready");
    }
    order.status = "LabReady";
    await order.save();
    return res.status(200).json(order);
  } catch (error) {
    return res.status(200).json("INTERNAL SERVER ERROR");
  }
}

async function getAllOrdersController(req, res) {
  try {
    const orders = await Order.find({ lab_id: req.userId });
    if (!orders[0]) {
      return res.status(404).json("No Orders Available");
    }
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(200).json("INTERNAL SERVER ERROR");
  }
}

async function getLabDocsController(req, res) {
  try {
    const docs = await User.findById(req.userId)
      .select("docsId")
      .populate("docsId");
    if (!docs.docsId[0]) {
      return res.status(404).json("No Doctors Available");
    }
    return res.status(200).json(docs.docsId);
  } catch (error) {
    return res.status(200).json("INTERNAL SERVER ERROR");
  }
}

async function orderPaidController(req, res) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json("Order Not Found");
    }
    order.paid = req.body.paid;
    await order.save();
    return res.status(200).json(order);
  } catch (error) {
    return res.status(200).json("INTERNAL SERVER ERROR");
  }
}

async function getProfitsController(req, res) {
  try {
    const orders = await Order.find({ lab_id: req.userId, status: "End" });
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
    return res.status(200).json("INTERNAL SERVER ERROR");
  }
}

async function setPublicDelivery(req, res) {
  try {
    const lab = await User.findById(req.userId);
    if (!lab) {
      return res.status(404).json("Lab not found");
    }
    if (lab.role !== "LAB") {
      return res.status(400).json("User is not lab");
    }
    lab.publicDelivery = req.body.publicDelivery;
    await lab.save();
    return res.status(200).json(lab);
  } catch (error) {
    return res.status(200).json("INTERNAL SERVER ERROR");
  }
}

async function removeDocFromLabController(req, res) {
  try {
    const lab = await User.findById(req.userId);
    if (!lab) {
      return res.status(404).json("Lab Not Found");
    }
    if (!lab.docsId.includes(req.params.id)) {
      return res.status(404).json("Doctor Not Found in Lab");
    }
    lab.docsId = lab.docsId.filter((doc) => doc.toString() !== req.params.id);
    await lab.save();
    return res.status(200).json(lab);
  } catch (error) {
    return res.status(200).json("INTERNAL SERVER ERROR");
  }
}

module.exports = {
  addDocController,
  updateDoctorContractController,
  getDoctorContractController,
  markOrderReadyController,
  getAllOrdersController,
  getLabDocsController,
  orderPaidController,
  getProfitsController,
  setPublicDelivery,
  removeDocFromLabController,
};
