import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { fileSize } from "./constants.js";

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true, limit: fileSize }));
app.use(express.json({ limit: fileSize }));
app.use(express.static("public"));

export default app;
