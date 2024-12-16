const { authClient, authAdmin } = require("../../../middlewares/authMiddleware");
const { getReport,getClientReport, getAgentReport, getAdminReport  } = require("../controllers/reportController");

const reportRoutes = require("express").Router();

reportRoutes.get("/list", authClient,  getReport);
reportRoutes.get("/clientReport", authAdmin,  getClientReport);
reportRoutes.get("/agentReport", authAdmin,  getAgentReport);
reportRoutes.get("/adminReport", authAdmin,  getAdminReport);


module.exports = reportRoutes;
