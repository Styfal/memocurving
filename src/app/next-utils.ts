const PORT = Number(process.env.PORT) || 3000
import next from "next"

export const nextApp = next({
    dev: process.env.NODE_ENV !== "production",
    port: PORT 
})

export const nextHandler = nextApp.getRequestHandler()
