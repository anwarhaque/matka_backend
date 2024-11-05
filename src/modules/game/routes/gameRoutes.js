const { authClient } = require("../../../middlewares/authMiddleware");
const { addGame, listGame, deleteGame } = require("../controllers/gameController");

const gameRoutes = require("express").Router();

gameRoutes.post("/add", authClient, addGame);
gameRoutes.get("/list", authClient, listGame);
gameRoutes.delete("/delete/:gameId", authClient, deleteGame);

module.exports = gameRoutes;
