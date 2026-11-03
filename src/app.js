import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()
// since you import it, now configure it 

// 1. cors
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// doing setting, since data is going to come from many places
// i.e is in the form of url se, json me se, body me through form and etc

// 1. this is data is coming in the form of forms
app.use(express.json({limit: "16kb"}))

// 2. data is coming through urls
app.use(express.urlencoded({extended: true, limit: "16kb"}))

// 3. static folders for files and folders eg pdf etc
app.use(express.static("public"))

app.use(cookieParser())

// ------------------------------------------------
// routes generally import in this way 
import userRouter from "./routes/user.routes.js"  

// routes declaration (best practices)
// it better to use versioning in the api, so that if you want to change the 
// api in future, you can do it without breaking the existing api
app.use("/api/v1/users", userRouter)

// http://localhost:8000/api/v1/users/register 

export { app }