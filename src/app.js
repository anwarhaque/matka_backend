const express = require("express");
const app = express();
const path = require("path");
const morgan = require("morgan");
const { basePath, baseRouter } = require("./helper/routeHelper");
const cors = require("cors");
const { CORS_OPTIONS } = require("./config/config");
const errorHandler = require("./middlewares/errorMiddleware");

app.use(cors(CORS_OPTIONS));
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "1mb", extended: true }));

app.use("/static", express.static(path.join(__dirname, "public")));
// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'SERVER IS UP' });
});
app.use(basePath, baseRouter);

app.use((req, res, next) => {
    const error = new Error("Route Not found..");
    error.statusCode = 404;
    next(error);
});


app.use(errorHandler);

module.exports = app;
