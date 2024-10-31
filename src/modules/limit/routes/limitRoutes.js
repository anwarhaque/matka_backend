const { updateAgentLimit, updateClientLimit, limitHistory } = require("../controllers/limitController");

const limitRoutes = require("express").Router();

limitRoutes.post("/updateAgentLimit", updateAgentLimit);
limitRoutes.post("/updateClientLimit", updateClientLimit);
limitRoutes.get("/limitHistory", limitHistory);

module.exports = limitRoutes;
