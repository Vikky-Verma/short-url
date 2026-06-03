const { setUser } = require("../service/auth");
const User = require("../models/user");

async function handleUserSignup(req, res) {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
        return res.status(400).json({ error: "Email already registered" });
    }

    const user = await User.create({ name, email, password });
    const token = setUser(user);

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
    });

    return res.status(201).json({
        message: "Signup successful",
        user: { name: user.name, email: user.email, role: user.role }
    });
}

async function handleUserLogin(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = setUser(user);
    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
    });

    return res.status(200).json({
        message: "Login successful",
        user: { name: user.name, email: user.email, role: user.role }
    });
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
};