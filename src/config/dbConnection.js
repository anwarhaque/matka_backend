const mongoose = require("mongoose");
const { DB_URL, NODE_ENV } = require("./config");

const dbConnect = async function () {
    try {
        console.log("Establishing Mongo DB Connection...");
        // console.log("DB_URL", DB_URL);
        const x = await mongoose.connect(DB_URL);
        console.log(`Mongo DB (${NODE_ENV}) Connected :)`);
        return false;
    } catch (error) {
        console.log("==== DB Connection Error ====", error.message);
        throw error;
    }
};

module.exports = { dbConnect };
