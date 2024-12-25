
const { authAdmin, authAgentAdmin } = require('../../../middlewares/authMiddleware');
const { superLogin, createAgent, updateAgent, getUser, listUser, createClient, updateClient, getProfile, changePassword, changeStatus, deleteUser } = require("../controllers/adminUserController");

const adminUserRoutes = require("express").Router();

adminUserRoutes.post("/login", superLogin);

adminUserRoutes.post("/createAgent", authAdmin, createAgent);
adminUserRoutes.put("/updateAgent/:agentId", authAdmin, updateAgent);

adminUserRoutes.post("/createClient", authAgentAdmin, createClient);
adminUserRoutes.put("/updateClient/:clientId", authAgentAdmin, updateClient);

adminUserRoutes.get("/getProfile", authAdmin, getProfile);
adminUserRoutes.put("/changePassword", authAdmin, changePassword);

adminUserRoutes.get("/getUser/:_id", authAgentAdmin, getUser);
adminUserRoutes.get("/listUser", authAgentAdmin, listUser);
adminUserRoutes.put("/changeStatus/:_id", authAgentAdmin, changeStatus);
adminUserRoutes.delete("/deleteUser/:_id", authAgentAdmin, deleteUser);




module.exports = adminUserRoutes;
