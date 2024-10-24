
const { authClient } = require("../../middlewares/authMiddleware");
const { clientLogin, getProfile, changePassword } = require("../controllers/clientUserController");

const clientUserRoutes = require("express").Router();

clientUserRoutes.post("/login", clientLogin);
clientUserRoutes.get("/getProfile", authClient, getProfile);
clientUserRoutes.put("/changePassword", authClient, changePassword);

module.exports = clientUserRoutes;
