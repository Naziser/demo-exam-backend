const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { secret } = require("../config.js");

const generateAccessToken = (id, roles) => {
  const payload = { id, roles };
  return jwt.sign(payload, secret, { expiresIn: "24h" });
};

class AuthController {
  async registration(req, res) {
    try {
      const { username, password, full_name, phone, email } = req.body;
      const candidate = await db.query(
        "SELECT * FROM users where username = $1",
        [username]
      );
      if (candidate.rows.length > 0) {
        return res.status(400).json({
          response: {
            status: 400,
          },
          message: "Пользователь с таким именем уже существует",
        });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      // Получение ID роли "USER"
      const userRoleId = await db.query(
        "SELECT id FROM roles WHERE value = $1",
        ["USER"]
      );
      // Создание нового пользователя
      const user = await db.query(
        "INSERT INTO users (username, password, full_name, phone, email) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, full_name, phone, email",
        [username, hashPassword, full_name, phone, email]
      );
      // Связывание пользователя с ролью
      const insertUserRoleText = await db.query(
        "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)",
        [user.rows[0].id, userRoleId.rows[0].id]
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
      const { username, password } = req.body;
      const user = await db.query(
    `
      SELECT users.id, users.password, ARRAY_AGG(roles.value) AS roles
      FROM users
      LEFT JOIN user_roles ON users.id = user_roles.user_id
      LEFT JOIN roles ON user_roles.role_id = roles.id
      WHERE users.username = $1
      GROUP BY users.id
    `,
        [username]
      );
      if (user.rows.length === 0) {
        return res.status(400).json({
          response: { status: 400 },
          message: `Пользователь ${username} не найден`,
        });
      }
      const validPassword = bcrypt.compareSync(password, user.rows[0].password);
      if (!validPassword) {
        return res.status(400).json({
          response: { status: 400 },
          message: "Введен неверный пароль",
        });
      }
      const token = generateAccessToken(user.rows[0].id, user.rows[0].roles);
      return res.json({token});
    } catch (e) {
      console.log(e);
      res
        .status(400)
        .json({ response: { status: 400 }, message: "Ошибка авторизации" });
    }
  }

  async getUsers(req, res) {
    try {
        const users = await db.query('SELECT * FROM users');
        res.status(200).json({response: { status: 200 }, payload: users.rows});
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new AuthController();
