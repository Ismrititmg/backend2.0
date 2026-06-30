import express from "express"
import dotenv from "dotenv"

import studentRouter from "./routes/student_route.js"
import courseRouter from "./routes/course_route.js"
import teacherRouter from "./routes/teacher_route.js"
import departmentRouter from "./routes/department_route.js"
import enrollmentRouter from "./routes/enrollment_route.js"
import { checkApiKeyInHeader, checkXRoleHeaderMiddle } from "./middleware/header_middleware.js"
import {  addRequestTimeStampMiddleware, customErrorMiddleware, customSuccessMiddleware } from "./middleware/add_request_timestamp_middleware.js"
import authRouter from "./routes/auth_route.js"

dotenv.config()

const app=express()
const PORT = process.env.PORT || 3000


app.use(express.json())

//route-based middleware
app.use("/req-time",addRequestTimeStampMiddleware,(req, res, next)=>{
    res.status(200).json({
        message:"request time attached",
        data: req.requestTimeStamp
    })
})

app.get("/err",(req, res, next)=>{
    try{
        throw new Error ("custom error throws error")
    }
    catch(e){
        next(e)
    }
})

app.get("/cdata", (req, res, next)=>{
    next({
        msg: "all data fetched",
        data: ["apple", "dfkjf"],
        trace:{
            method: "GET",
            route: "/cdata"
        }
    })
})
app.use(customSuccessMiddleware)

//custom middleware
app.use ((req, res, next)=>{
    console.log("req url:", req.url)
    if(req.url == "/"){
        res.json({
            errorMsg: "this url cannot be access"
        })
        return
    }
    next()
})

app.use(checkXRoleHeaderMiddle)

app.use("/apikey", checkApiKeyInHeader, (req, res)=>{
    res.status(200).json({
        message: "api key called",
        data: req.headers["x-api-key"]
    })
})

app.use("/students", studentRouter)
app.use("/courses",courseRouter)
app.use("/teacher",teacherRouter)
app.use("/department",departmentRouter)
app.use("/enrollment",enrollmentRouter)
app.use("/auth", authRouter)
//res 

app.use(customErrorMiddleware)
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})