
const { authAdmin } = require('../../middlewares/authMiddleware')
const { superLogin, createAgent, createClient, getProfile, changePassword } = require("../controllers/adminUserController");

const adminUserRoutes = require("express").Router();

adminUserRoutes.post("/login", superLogin);
adminUserRoutes.post("/createAgent", authAdmin, createAgent);
adminUserRoutes.post("/createClient", authAdmin, createClient);
adminUserRoutes.get("/getProfile", authAdmin, getProfile);
adminUserRoutes.put("/changePassword", authAdmin, changePassword);

module.exports = adminUserRoutes;
