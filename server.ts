import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import * as Sentry from "@sentry/node";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const config = require("./config.ts");
const indexRouter = require("./routes");
const router = express.Router();

Sentry.init({
  dsn: process.env.PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({
      tracing: true,
    }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({
      app,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!,
});

// Trace incoming requests
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

router.use("/", indexRouter);

app.use(bodyParser.json());
app.use(config.baseUrl, router);

// The error handler must be registered before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

app.use(function (req, res) {
  res.status(404).send({ error: `url ${req.originalUrl} not found` });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
