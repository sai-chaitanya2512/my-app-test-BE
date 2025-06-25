// models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String }, // optional initially, can be updated later
    role: { type: String, default: "user" }, // default role is "user"
    otp: { type: String, expires: 300 },
    otpCreatedAt: { type: Date }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
