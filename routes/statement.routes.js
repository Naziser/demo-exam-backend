const express = require('express');
const statementController = require('../controllers/statement.controller.js');
const authMiddleware = require("../middleware/authMiddleware.js");
const roleMiddleware = require("../middleware/roleMiddleware.js");

const router = express.Router();

router.get('/my-statements', authMiddleware, statementController.getMyStatements);
router.get('/statement', authMiddleware, statementController.getStatementById);
router.post('/create-statement', authMiddleware, statementController.createStatement);
router.put('/update-status', authMiddleware, roleMiddleware('ADMIN'), statementController.updateStatementStatus);
router.get('/all-statements', authMiddleware, roleMiddleware('ADMIN'), statementController.getAllStatements);

module.exports = router;