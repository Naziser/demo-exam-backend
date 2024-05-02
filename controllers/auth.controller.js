const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { secret } = require("../config.js");

const generateAccessToken = (id, login, full_name, phone, email, role) => {
  const payload = { id, login, full_name, phone, email, role };
  return jwt.sign(payload, secret, { expiresIn: "24h" });
};

class AuthController {
  async registration(req, res) {
    try {
      const { login, password, full_name, phone, email } = req.body;
      const candidate = await db.query("SELECT * FROM users where login = $1", [
        login,
      ]);
      if (candidate.rows.length > 0) {
        return res.status(400).json({
          response: {
            status: 400,
          },
          message: "Пользователь с таким именем уже существует",
        });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const user = await db.query(
        "INSERT INTO users (login, password, full_name, phone, email) VALUES ($1, $2, $3, $4, $5) RETURNING id, login, full_name, phone, email, role",
        [login, hashPassword, full_name, phone, email]
      );

      return res.status(200).json({
        response: {
          status: 200,
        },
        message: "Пользователь успешно зарегистрирован",
        payload: user.rows[0],
      });
    } catch (e) {
      console.log(e);
      res.status(400).json({
        response: {
          status: 400,
        },
        message: "Ошибка регистрации",
      });
    }
  }

  async login(req, res) {
    try {
      const { login, password } = req.body;
      const user = await db.query("SELECT * from users where login = $1", [
        login,
      ]);
      if (user.rows.length === 0) {
        return res.status(403).json({
          response: { status: 403 },
          message: `Пользователь ${login} не найден`,
        });
      }
      const validPassword = bcrypt.compareSync(password, user.rows[0].password);
      if (!validPassword) {
        return res.status(403).json({
          response: { status: 403 },
          message: "Введен неверный пароль",
        });
      }
      const token = generateAccessToken(user.rows[0].id, user.rows[0].login, user.rows[0].full_name, user.rows[0].phone, user.rows[0].email, user.rows[0].role);
      return res.json({ token });
    } catch (e) {
      console.log(e);
      res
        .status(400)
        .json({ response: { status: 400 }, message: "Ошибка авторизации" });
    }
  }

  async check(req, res) {
    const token = generateAccessToken(req.user.id, req.user.login, req.user.full_name, req.user.phone, req.user.email, req.user.role);
    return res.json({ response: { status: 200 }, payload: { active: true, token } });
  }

  async getUsers(req, res) {
    try {
      const users = await db.query("SELECT * FROM users");
      res.status(200).json({ response: { status: 200 }, payload: users.rows });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new AuthController();
