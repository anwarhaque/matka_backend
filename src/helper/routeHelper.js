const { Router } = require("express");
const adminUserRoutes = require("../modules/user/routes/adminUserRoutes");
const agentUserRoutes = require("../modules/user/routes/agentUserRoutes");
const clientUserRoutes = require("../modules/user/routes/clientUserRoutes");
const limitRoutes = require("../modules/limit/routes/limitRoutes");
const drowRoutes = require("../modules/drow/routes/drowRoutes");

const baseRouter = Router();
const basePath = '/v1/api'

// Admin routes
baseRouter.use("/admin", adminUserRoutes);

//Agent routes
baseRouter.use("/agent", agentUserRoutes);

//Client routes
baseRouter.use("/client", clientUserRoutes);

baseRouter.use("/limit", limitRoutes);

baseRouter.use("/drow", drowRoutes);


module.exports = { basePath, baseRouter };
