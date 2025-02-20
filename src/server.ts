// import express from "express"
// import { getPayloadClient } from "./get-payload"
// import { nextApp, nextHandler } from "./app/next-utils"

// const app = express()
// const PORT = Number(process.env.PORT) || 3000 

// const start = async () => {
//     const payload = await getPayloadClient({
//         initOptions: {
//             express: app, 
//             onInit: async (cms) =>{
//                 cms.logger.info(`Admin URL ${cms.getAdminURL()}`)
//             },
//         },
//     })


//     app.use((req, res) => nextHandler(req, res))



//     nextApp.prepare().then(() => {
//         payload.logger.info("Next.js started")

//         app.listen(PORT, async () => {
//             payload.logger.info(`Next.js App URL: ${process.env.NEXT_PUBLIC_SERVER_URL}`)
//         })
//     }
      
//     )


// }

// start()

import express from "express"
import { getPayloadClient } from "./get-payload"
import { nextApp, nextHandler } from "./app/next-utils"
import openAiRouter from "./app/api/ai/openai"  // Updated path

const app = express()
const PORT = Number(process.env.PORT) || 3000 

const start = async () => {
  const payload = await getPayloadClient({
    initOptions: {
      express: app, 
      onInit: async (cms) => {
        cms.logger.info(`Admin URL ${cms.getAdminURL()}`)
      },
    },
  })

  // Enable JSON body parsing
  app.use(express.json())

  // Mount the OpenAI API route
  app.use("/api/openai", openAiRouter)

  // Catch-all Next.js handler (should be last)
  app.use((req, res) => nextHandler(req, res))

  nextApp.prepare().then(() => {
    payload.logger.info("Next.js started")
    app.listen(PORT, async () => {
      payload.logger.info(`Next.js App URL: ${process.env.NEXT_PUBLIC_SERVER_URL}`)
    })
  })
}

start()
