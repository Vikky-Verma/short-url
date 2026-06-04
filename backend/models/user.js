const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
      type: String,
      required: true,
      default: "NORMAL",
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true });

// ✅ Hash password before saving
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model("User", userSchema);

module.exports = User;