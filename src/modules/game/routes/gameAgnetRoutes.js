const { authAgent } = require("../../../middlewares/authMiddleware");
const { addGame, listGame, deleteGame } = require("../controllers/gameAgentController");

const gameAgentRoutes = require("express").Router();

gameAgentRoutes.post("/add", authAgent, addGame);
gameAgentRoutes.get("/list", authAgent, listGame);
gameAgentRoutes.delete("/delete/:gameId/:clientId", authAgent, deleteGame);

module.exports = gameAgentRoutes;
