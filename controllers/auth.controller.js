const db = require("../db");
const bcrypt = require("bcrypt");

class AuthController {
  async registration(req, res) {
    try {
      const { username, password, full_name, phone, email } = req.body;
      const candidate = await db.query(
        "SELECT * FROM users where username = $1",
        [username]
      );
      if (candidate.rows.length > 0) {
        return res
          .status(400)
          .json({ message: "Пользователь с таким именем уже существует" });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      // Получение ID роли "USER"
      const userRoleId = await db.query(
        "SELECT id FROM roles WHERE value = $1",
        ["USER"]
      );
      // Создание нового пользователя
      const user = await db.query(
        "INSERT INTO users (username, password, full_name, phone, email) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [username, hashPassword, full_name, phone, email]
      );
      // Связывание пользователя с ролью
      const insertUserRoleText = await db.query(
        "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)",
        [user.rows[0].id, userRoleId.rows[0].id]
      );

      return res
        .status(200)
        .json({ message: "Пользователь успешно зарегистрирован" });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Registration error" });
    }
  }

  async login() {
    try {
      res.json("login request");
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Login error" });
    }
  }

  async getUsers(req, res) {
    try {
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new AuthController();
