const { authClient } = require("../../../middlewares/authMiddleware");
const { getReport,  } = require("../controllers/reportController");

const reportRoutes = require("express").Router();

reportRoutes.get("/list", authClient,  getReport);


module.exports = reportRoutes;
