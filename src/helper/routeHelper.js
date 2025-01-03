const { Router } = require("express");
const adminUserRoutes = require("../modules/user/routes/adminUserRoutes");
const agentUserRoutes = require("../modules/user/routes/agentUserRoutes");
const clientUserRoutes = require("../modules/user/routes/clientUserRoutes");
const limitRoutes = require("../modules/limit/routes/limitRoutes");
const drowRoutes = require("../modules/drow/routes/drowRoutes");
const gameRoutes = require("../modules/game/routes/gameRoutes");
const openStatusRoutes = require("../modules/openStatus/routes/openStatusRoutes");
const reportRoutes = require("../modules/report/routes/reportRoutes");
const gameAgentRoutes = require("../modules/game/routes/gameAgnetRoutes");

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

baseRouter.use("/game", gameRoutes);
baseRouter.use("/agent/game", gameAgentRoutes);

baseRouter.use("/open-status", openStatusRoutes);

baseRouter.use("/report", reportRoutes);


module.exports = { basePath, baseRouter };
