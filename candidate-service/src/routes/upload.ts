import { Hono } from "hono";
import { uploadResumeController } from "../controllers/upload.controller";

const upload = new Hono<{ Bindings: CloudflareBindings }>();

upload.post("/", uploadResumeController);

export default upload;