const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    UID: {
      type: String,
      required: true,
      maxLength: 255,
    },
    patientName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 255,
    },
    age: {
      type: Number,
      required: false,
    },
    teethNo: {
      type: Number,
      required: true,
    },
    sex: {
      type: String,
      required: false,
    },
    color: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: true,
      maxLength: 255,
    },
    description: {
      type: String,
      required: false,
    },
    voiceNote: {
      type: String,
      required: false,
    },
    screen: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: true,
      default: "DocReady",
      maxLength: 255,
    },
    price: {
      type: Number,
      required: true,
    },
    paid: {
      type: Number,
      required: true,
    },
    lab_id: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    doc_id: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
exports.Order = Order;
