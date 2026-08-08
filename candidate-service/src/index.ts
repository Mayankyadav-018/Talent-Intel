import { Hono } from "hono";
import { cors } from "hono/cors";

import health from "./routes/health";
import candidate from "./routes/candidate";
import upload from "./routes/upload";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

app.route("/health", health);
app.route("/api/v1/candidates", candidate);
app.route("/api/v1/upload-resume", upload);

export default app;