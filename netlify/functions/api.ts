import serverless from "serverless-http";
import express from "express";
import { apiRouter } from "../../src/apiRoutes";

const app = express();

// Set rawBody on requests containing raw buffer data
app.use(express.json({
  verify: (req, res, buf) => {
    (req as any).rawBody = buf;
  }
}));

// Provide the routes inside Netlify functions
app.use("/api", apiRouter);
// Netlify invokes functions with the path /.netlify/functions/<function-name>
app.use("/.netlify/functions/api", apiRouter);

export const handler = serverless(app);

