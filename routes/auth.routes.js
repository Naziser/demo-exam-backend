const Router = require("express");
const router = new Router();
const authController = require("../controllers/auth.controller.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const roleMiddleware = require("../middleware/roleMiddleware.js");

router.post("/registration", authController.registration);
router.post("/login", authController.login);
router.get('/check', authMiddleware, authController.check);
router.get("/users", roleMiddleware('ADMIN'), authController.getUsers);

module.exports = router;
