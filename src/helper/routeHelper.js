const { Router } = require("express");
const adminUserRoutes = require("../user/routes/adminUserRoutes");
const agentUserRoutes = require("../user/routes/agentUserRoutes");
const clientUserRoutes = require("../user/routes/clientUserRoutes");

const baseRouter = Router();
const basePath = '/v1/api'

// Admin routes
baseRouter.use("/admin", adminUserRoutes);

//Agent routes
baseRouter.use("/agent", agentUserRoutes);

//Client routes
baseRouter.use("/client", clientUserRoutes);
  

module.exports = { basePath, baseRouter };
