const { authAdmin } = require("../../../middlewares/authMiddleware");
const { getOpenStatus } = require("../controllers/openStatusController");

const openStatusRoutes = require("express").Router();

openStatusRoutes.get("/list", authAdmin,  getOpenStatus);

module.exports = openStatusRoutes;
