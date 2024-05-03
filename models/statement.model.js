const db = require("../db");

class Statement {
  static async findByUserId(userId, limit, offset) {
    const statements = await db.query(
      "SELECT * FROM statements WHERE user_id = $1 ORDER BY id LIMIT $2 OFFSET $3",
      [userId, limit, offset]
    );

    const countResult = await db.query(
      "SELECT COUNT(*) FROM statements WHERE user_id = $1",
      [userId]
    );

    return {
      data: statements.rows,
      totalItems: parseInt(countResult.rows[0].count, 10),
    };
  }

  static async create(userId, vehicleRegistrationNumber, violationDescription) {
    return db.query(
      "INSERT INTO statements (user_id, vehicle_registration_number, violation_description) VALUES ($1, $2, $3) RETURNING *",
      [userId, vehicleRegistrationNumber, violationDescription]
    );
  }

  static async updateStatus(id, status) {
    return db.query(
      "UPDATE statements SET status = $2 WHERE id = $1 RETURNING *",
      [id, status]
    );
  }

  static async findAll() {
    return db.query("SELECT * FROM statements");
  }
}

module.exports = Statement;
