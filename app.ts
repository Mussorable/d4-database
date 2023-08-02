import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import { mongoDB } from "./config.json";
import skillRouter from "./routes/skills.router";

const startApplication = async () => {
  const app = express();
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use(skillRouter);

  try {
    const connect = await mongoose.connect(mongoDB);
    app.listen(8080);
  } catch (error) {
    console.error(error);
  }
};

startApplication();
