import express, { Request, Response } from "express";
import { Document } from "mongodb";
import * as Sentry from "@sentry/node";

const router = express.Router();
const mongoDB = require("../connection");
const jwt = require("../services/jwt");

router.get("/", (req: Request, res: Response) => {
  let html = "";
  html += `<h1>Welcome, check out my portfolio <a href="https://justinbond.dev">justinbond.dev</a></h1>`;

  res.send(html);
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const token = jwt.getToken(req);

    if (token && token === process.env.API_TOKEN) {
      const response = await mongoDB
        .db_connect()
        .then((db: Document) => db.insertOne(req.body));

      res.send(response);
    } else {
      throw new Error("Invalid authorization header.");
    }
  } catch (err: any) {
    Sentry.captureException(err);
    res.send({ error: err?.message || true });
    console.error(`Something went wrong trying to insert: ${err}\n`);
  }
});

router.get("/list", async (req: Request, res: Response) => {
  try {
    const token = jwt.getToken(req);

    if (token && token === process.env.API_TOKEN) {
      const response = await mongoDB
        .db_connect()
        .then((db: Document) => db.find({}).toArray());

      res.send(response);
    } else {
      throw new Error("Invalid authorization header.");
    }
  } catch (err: any) {
    Sentry.captureException(err);
    res.send({ error: err?.message || true });
    console.error(`Something went wrong: ${err}\n`);
  }
});

module.exports = router;
