//import { Hono } from "hono";
//import { parseResumeWithGemini } from "../services/gemini.service";

//const gemini = new Hono<{ Bindings: CloudflareBindings }>();

//gemini.get("/", async (c) => {
//  const sampleResume = `
//Mayank Yadav

//Email: mayank@example.com

//Phone: 9876543210

//GitHub: https://github.com/MayankYadav

//LinkedIn: https://linkedin.com/in/mayankyadav

//Skills:
//AWS
//Docker
//Cloudflare
//TypeScript
//React

//Education:
//B.Tech Electronics and Telecommunication Engineering

//Projects:
//Candidate Service
//`;
//console.log("API KEY EXISTS:", !!c.env.GEMINI_API_KEY);
//console.log("API KEY PREFIX:", c.env.GEMINI_API_KEY.substring(0, 10));

//  const result = await parseResumeWithGemini(
 //   sampleResume,
 //   c.env.GEMINI_API_KEY
//  );

//  return c.text(result);
//});

//export default gemini;//*