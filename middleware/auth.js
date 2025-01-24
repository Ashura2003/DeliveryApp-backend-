const jwt = require("jsonwebtoken");

const authGuard = async (req, res, next) => {
  console.log(req.headers);

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ success: false, message: "Token is missing" });
  }

  const token = authHeader.split(" ")[1];

  if (!token || token === "") {
    return res
      .status(401)
      .json({ success: false, message: "Token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false, message: "Invalid Token" });
  }
};

module.exports = authGuard;