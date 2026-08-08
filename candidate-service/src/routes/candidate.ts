import { Hono } from "hono";
import { createCandidateController } from "../controllers/candidate.controller";

const candidate = new Hono<{ Bindings: CloudflareBindings }>();

candidate.get("/", (c) => {
  return c.json({
    message: "Candidate API is working!",
  });
});

candidate.post("/", createCandidateController);

export default candidate;