const jwt = require("jsonwebtoken");

exports.verifyToken = async(req, res, next) => {
    if (!req.header('Authorization')) {
      return res.status(403).send("header authorization is empty")
    }
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY)
        req.user = decoded
        req.token = token
    } catch (err) {
      return res.status(401).send("Invalid Token");
    }
    return next();
  };
  