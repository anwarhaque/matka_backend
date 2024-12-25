const { authAgentAdmin } = require("../../../middlewares/authMiddleware");
const { updateAgentLimit, updateClientLimit, limitHistory } = require("../controllers/limitController");

const limitRoutes = require("express").Router();

limitRoutes.post("/updateAgentLimit",authAgentAdmin, updateAgentLimit);
limitRoutes.post("/updateClientLimit", authAgentAdmin, updateClientLimit);
limitRoutes.get("/limitHistory", authAgentAdmin,  limitHistory);

module.exports = limitRoutes;
