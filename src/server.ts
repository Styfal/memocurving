
// import express from "express"
// import { getPayloadClient } from "./get-payload"
// import { nextApp, nextHandler } from "./app/next-utils"
// import openAiRouter from "./app/api/ai/openai"  // Updated path

// const app = express()
// const PORT = Number(process.env.PORT) || 3000 

// const start = async () => {
//   const payload = await getPayloadClient({
//     initOptions: {
//       express: app, 
//       onInit: async (cms) => {
//         cms.logger.info(`Admin URL ${cms.getAdminURL()}`)
//       },
//     },
//   })

//   // Enable JSON body parsing
//   app.use(express.json())

//   // Mount the OpenAI API route
//   app.use("/api/openai", openAiRouter)

//   // Catch-all Next.js handler (should be last)
//   app.use((req, res) => nextHandler(req, res))

//   nextApp.prepare().then(() => {
//     payload.logger.info("Next.js started")
//     app.listen(PORT, async () => {
//       payload.logger.info(`Next.js App URL: ${process.env.NEXT_PUBLIC_SERVER_URL}`)
//     })
//   })
// }

// start()


import express from "express";
import { getPayloadClient } from "./get-payload";
import { nextApp, nextHandler } from "./app/next-utils";
import { POST as openaiPOST } from "./app/api/ai/openai/route";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const start = async () => {
  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: async (cms) => {
        cms.logger.info(`Admin URL ${cms.getAdminURL()}`);
      },
    },
  });

  // Enable JSON body parsing
  app.use(express.json());

  // Inline adapter: handle POST requests at /api/ai/openai
  app.post("/api/ai/openai", async (req, res) => {
    try {
      // Convert Express headers (IncomingHttpHeaders) into a plain object.
      const headers: Record<string, string> = {};
      for (const [key, value] of Object.entries(req.headers)) {
        if (value) {
          headers[key] = Array.isArray(value) ? value.join(",") : value;
        }
      }

      // Create a new Next.js compatible Request.
      const nextRequest = new Request(req.originalUrl, {
        method: "POST",
        headers, // now a valid HeadersInit object
        body: JSON.stringify(req.body),
      });

      // Call the Next.js API route handler.
      const nextResponse = await openaiPOST(nextRequest);

      // Extract the JSON body and status from the Next.js response.
      const data = await nextResponse.json();
      res.status(nextResponse.status).json(data);
    } catch (error) {
      console.error("Error in OpenAI route:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Catch-all Next.js handler (should be last)
  app.use((req, res) => nextHandler(req, res));

  nextApp.prepare().then(() => {
    payload.logger.info("Next.js started");
    app.listen(PORT, async () => {
      payload.logger.info(`Next.js App URL: ${process.env.NEXT_PUBLIC_SERVER_URL}`);
    });
  });
};

start();
