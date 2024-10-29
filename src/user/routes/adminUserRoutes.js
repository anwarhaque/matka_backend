
const { authAdmin } = require('../../middlewares/authMiddleware')
const { superLogin, createAgent, updateAgent, getUser, listUser, createClient, updateClient, getProfile, changePassword, changeStatus, deleteUser } = require("../controllers/adminUserController");

const adminUserRoutes = require("express").Router();

adminUserRoutes.post("/login", superLogin);

adminUserRoutes.post("/createAgent", authAdmin, createAgent);
adminUserRoutes.put("/updateAgent/:agentId", authAdmin, updateAgent);

adminUserRoutes.post("/createClient", authAdmin, createClient);
adminUserRoutes.put("/updateClient/:clientId", authAdmin, updateClient);

adminUserRoutes.get("/getProfile", authAdmin, getProfile);
adminUserRoutes.put("/changePassword", authAdmin, changePassword);

adminUserRoutes.get("/getUser/:_id", authAdmin, getUser);
adminUserRoutes.get("/listUser", authAdmin, listUser);
adminUserRoutes.put("/changeStatus/:_id", authAdmin, changeStatus);
adminUserRoutes.delete("/deleteUser/:_id", authAdmin, deleteUser);

module.exports = adminUserRoutes;
