const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
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
    required: true,
  },
  teethNo: {
    type: Number,
    required: true,
  },
  sex: {
    type: String,
    required: true,
    maxLength: 255,
  },
  color: {
    type: String,
    required: true,
    maxLength: 255,
  },
  type: {
    type: String,
    required: true,
    maxLength: 255,
  },
  description: {
    type: String,
    required: true,
    maxLength: 255,
  },
  voiceNote: {
    type: String,
    required: true,
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
  }
});

const Order = mongoose.model("Order", orderSchema);
exports.Order = Order;
