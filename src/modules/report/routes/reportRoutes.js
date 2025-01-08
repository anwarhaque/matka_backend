const { authClient, authAdmin, authAgentAdmin } = require("../../../middlewares/authMiddleware");
const { getReport,getClientReport, getAgentReport, getAdminReport  } = require("../controllers/reportController");

const reportRoutes = require("express").Router();

reportRoutes.get("/list", authClient,  getReport);
reportRoutes.get("/clientReport", authAgentAdmin,  getClientReport);
reportRoutes.get("/agentReport", authAgentAdmin,  getAgentReport);
reportRoutes.get("/adminReport", authAdmin,  getAdminReport);


module.exports = reportRoutes;
