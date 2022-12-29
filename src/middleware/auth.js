const jwt = require("jsonwebtoken");
const User = require("../models/users");

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // else if(req.cookies.token){
  //     token = req.cookies.token;
  // }

  // Make sure token exists
  if (!token) {
    return res.status(401).send("Not authorize to access this route");
  }
  try {
    // verify token against
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return res.status(401).send("Not authorize to access this route");
  }
};
