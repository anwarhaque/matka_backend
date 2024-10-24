const https = require("http");
const app = require("./app");
const { dbConnect } = require("./config/dbConnection");
const { PORT } = require("./config/config");
const { createSuperUser } = require("./helper/createSuperUser");

const server = https.createServer(app);


dbConnect().then(async (_) => {
  await createSuperUser()
  server.listen(PORT, (_) => console.log(`Server is Running on http://localhost:${PORT}`));
});
