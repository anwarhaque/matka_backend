const { addLimit, listLimit } = require("../controlles/limitController");

const limitRoutes = require("express").Router();

limitRoutes.post("/addLimit", addLimit);
limitRoutes.get("/listLimit/:userId", listLimit);

module.exports = limitRoutes;
