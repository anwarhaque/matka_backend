const { authAdmin } = require("../../../middlewares/authMiddleware");
const { addMarquee, updateMarquee,  getMarquee } = require("../controllers/marqueeController");
const marqueeRoutes = require("express").Router();

// marqueeRoutes.post("/addMarquee", authAdmin, addMarquee);
marqueeRoutes.put("/updateMarquee/:marqueeId", authAdmin, updateMarquee);
marqueeRoutes.get("/getMarquee", getMarquee);


module.exports = marqueeRoutes;
