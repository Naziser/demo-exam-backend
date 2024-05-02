const jwt = require("jsonwebtoken");
const { secret } = require("../config.js");

module.exports = function (requiredRole) {
  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
    }

    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Пользователь не авторизован" });
      }
      const decodedData = jwt.verify(token, secret);
      if (decodedData.role !== requiredRole) {
        return res.status(403).json({ message: "У вас нет доступа" });
      }
      req.user = decodedData;
      next();
    } catch (e) {
      console.log(e);
      return res.status(401).json({ message: "Пользователь не авторизован" });
    }
  };
};
