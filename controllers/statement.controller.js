const Statement = require("../models/statement.model.js");

class StatementController {
  async getMyStatements(req, res) {
    try {
      const { id } = req.user;
      const result = await Statement.findByUserId(id);
      res.json(result.rows);
    } catch (e) {
      res.status(500).json({ message: "Не удалось получить заявления" });
    }
  }

  async createStatement(req, res) {
    try {
      const { id } = req.user;
      const { vehicleRegistrationNumber, violationDescription } = req.body;
      const result = await Statement.create(
        id,
        vehicleRegistrationNumber,
        violationDescription
      );
      res.status(201).json(result.rows[0]);
    } catch (e) {
      res.status(500).json({ message: "Не удалось создать заявление" });
    }
  }

  async updateStatementStatus(req, res) {
    try {
      const { id, status } = req.body;
      const result = await Statement.updateStatus(id, status);
      res.json(result.rows[0]);
    } catch (e) {
      res.status(500).json({ message: "Не удалось обновить статус заявления" });
    }
  }

  async getAllStatements(req, res) {
    try {
      const result = await Statement.findAll();
      res.json(result.rows);
    } catch (e) {
      res.status(500).json({ message: "Не удалось получить все заявления" });
    }
  }
}

module.exports = new StatementController();
