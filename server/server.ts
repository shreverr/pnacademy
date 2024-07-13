import app from "./app";
import { connectDatabase, sequelize } from "./config/database";
import logger from "./config/logger";
import swaggerDocs from "./config/swagger";

logger.info("/////////////////////////////////////////////");
logger.info("/////////////////////////////////////////////");
logger.info("//                                         //");
logger.info("//          Pnacademy Web Server           //");
logger.info("//                                         //");
logger.info("/////////////////////////////////////////////");
logger.info("/////////////////////////////////////////////");

const port = process.env.PORT ?? 3000;

void connectDatabase();

void sequelize
  .sync({
    force: process.env.ENVIRONMENT === "dev",
  })
  .then(() => {
    logger.info("Postgres database synced successfully!");
  })
  .catch((error) => {
    logger.fatal(`Error in syncing to DB: ${error}`);
  });

const server = app.listen(port, () => {
  logger.info(`Server listening at http://localhost:${port}`);
  swaggerDocs(app);
});

process.on("uncaughtException", (err) => {
  // log the exception
  logger.fatal(err, "uncaught exception detected");
  // shutdown the server gracefully
  server.close(() => {
    process.exit(1); // then exit
  });

  // If a graceful shutdown is not achieved after 1 second,
  // shut down the process completely
  setTimeout(() => {
    process.abort(); // exit immediately and generate a core dump file
  }, 1000).unref();
  process.exit(1);
});
