const { authAdmin } = require("../../../middlewares/authMiddleware");
const { addDrow, updateDrow, listDrow, getDrow, changeDrowStatus, deleteDrow } = require("../controllers/drowController");

const drowRoutes = require("express").Router();

drowRoutes.post("/add", authAdmin, addDrow);
drowRoutes.put("/update/:drowId", authAdmin, updateDrow);
drowRoutes.get("/list", listDrow);
drowRoutes.get("/details/:drowId", getDrow);
drowRoutes.put("/status/:drowId", authAdmin, changeDrowStatus);
drowRoutes.delete("/delete/:drowId", authAdmin, deleteDrow);

module.exports = drowRoutes;
