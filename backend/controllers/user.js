const bcrypt = require("bcrypt");
const { setUser } = require("../service/auth");
const User = require("../models/user");

const cookieOptions = {
    httpOnly: true,
    sameSite: "none",
    secure: true,
};

async function handleUserSignup(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                error: "All fields are required",
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: "Email already registered",
            });
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        const token = setUser(user);

        res.cookie("token", token, cookieOptions);

        return res.status(201).json({
            success: true,
            message: "Signup successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Signup Error:", error);

        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
}

async function handleUserLogin(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: "Email and password are required",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                error: "Invalid email or password",
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: "Invalid email or password",
            });
        }

        const token = setUser(user);

        res.cookie("token", token, cookieOptions);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login Error:", error);

        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
};