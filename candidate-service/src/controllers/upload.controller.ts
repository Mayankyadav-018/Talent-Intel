import type { Context } from "hono";
import { uploadResume } from "../services/upload.service";

export async function uploadResumeController(c: Context) {
  try {
    const formData = await c.req.formData();

const file = formData.get("resume");

const full_name = formData.get("full_name") as string;
const email = formData.get("email") as string;
const github_username = formData.get("github_username") as string;

if (!(file instanceof File)) {
  return c.json(
    {
      success: false,
      error: "Resume file is required",
    },
    400
  );
}

const result = await uploadResume(
  c.env,
  file,
  {
    full_name,
    email,
    github_username,
  }
);

return c.json(
  {
    success: true,
    data: result,
  },
  201
);
  } catch (error) {
    console.error("Upload controller error:", error);

    return c.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to upload resume",
      },
      500
    );
  }
}