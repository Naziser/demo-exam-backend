const jwt = require("jsonwebtoken");
const { secret } = require("../config.js");

module.exports = function (req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({
          status: 401,
          payload: { active: false },
          message: "Пользователь не авторизован",
        });
    }
    const decodedData = jwt.verify(token, secret);
    req.user = decodedData;
    next();
  } catch (e) {
    console.log(e);
    return res
      .status(401)
      .json({ message: "Пользователь не авторизован", status: 401 });
  }
};
