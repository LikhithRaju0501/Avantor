const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, "your-secret-key", (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Invalid token, Please Login Again" });
    }

    req.userId = decoded.userId;
    next();
  });
};

module.exports = authenticateToken;
