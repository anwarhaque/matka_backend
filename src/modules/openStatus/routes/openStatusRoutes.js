const { authAdmin } = require("../../../middlewares/authMiddleware");
const { getOpenStatus, updateResult } = require("../controllers/openStatusController");

const openStatusRoutes = require("express").Router();

openStatusRoutes.get("/list", authAdmin,  getOpenStatus);
openStatusRoutes.post("/result", authAdmin,  updateResult);

module.exports = openStatusRoutes;
