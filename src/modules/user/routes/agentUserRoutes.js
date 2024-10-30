
const { authAgent } = require("../../../middlewares/authMiddleware");
const { agentLogin, createClient, getProfile, changePassword } = require("../controllers/agentUserController");

const agentUserRoutes = require("express").Router();

agentUserRoutes.post("/login", agentLogin);
agentUserRoutes.post("/createClient", authAgent ,createClient);
agentUserRoutes.get("/getProfile", authAgent, getProfile);
agentUserRoutes.put("/changePassword", authAgent, changePassword);

module.exports = agentUserRoutes;
