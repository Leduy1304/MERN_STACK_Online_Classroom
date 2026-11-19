const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "supersecretkey_online_classroom_2026_ptudweb",
    {
      expiresIn: "30d",
    }
  );
};

module.exports = generateToken;
