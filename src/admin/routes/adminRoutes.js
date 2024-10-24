const { authAdmin } = require("../../middlewares/authMiddleware");
const { login, signup, profile } = require("../controllers/adminController");

const adminRoutes = require("express").Router();

adminRoutes.post("/login", login);
adminRoutes.post("/signup", signup);

adminRoutes.get("/profile", authAdmin, profile);

module.exports = adminRoutes;
