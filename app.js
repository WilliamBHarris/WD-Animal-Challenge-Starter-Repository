const express = require("express");
const db = require("./db");

const app = express();

app.use(require("./middleware/headers"));

const controllers = require("./controllers");

app.use(express.json());

app.use("/user", controllers.userController);

app.use("/create", controllers.userController);

db.authenticate()
  .then(() => db.sync()) // => {force: true}
  .then(() => {
    app.listen(3000, () =>
      console.log(`[Server: ] App is listening on Port ${3000}`)
    );
  })
  .catch((err) => {
    console.log("[Server: ] Server Crashed");
    console.error(err);
  });
