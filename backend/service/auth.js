const jwt = require("jsonwebtoken");

// ✅ Use env variable, not hardcoded secret
const secret = process.env.JWT_SECRET;

function setUser(user) {
    return jwt.sign(
      {
         _id: user._id,
         email: user.email,
         role: user.role,
      },
      secret
    );
}

function getUser(token) {
    if (!token) return null;
    return jwt.verify(token, secret);
}

module.exports = {
    setUser,
    getUser,
};