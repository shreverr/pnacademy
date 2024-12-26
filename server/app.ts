import express from "express";
import "dotenv/config";
import pinoHttp from "pino-http";
import logger from "./config/logger";
import instantiateModels from "./schema/index";
import router from "./routes";
import { handleError, jsonParseError } from "./middleware/error";
import cors from 'cors'
import { addGeneralPermissionToLambda } from "./config/lambdaClient";

const app = express();

app.use(cors())
app.use(express.json());
app.use(jsonParseError)
app.use(pinoHttp({ logger, useLevel: "trace" }));
app.use(router);
app.use(handleError);

instantiateModels();
addGeneralPermissionToLambda();

export default app;
