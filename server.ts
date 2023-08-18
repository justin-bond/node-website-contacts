import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const config = require("./config.ts");
const indexRouter = require("./routes");
const router = express.Router();

router.use("/", indexRouter);

app.use(bodyParser.json());
app.use(config.baseUrl, router);
app.use(function (req, res) {
  res.status(404).send({ error: `url ${req.originalUrl} not found` });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
