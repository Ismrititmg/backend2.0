import express from "express"
import dotenv from "dotenv"

import studentRouter from "./routes/student_route.js"
import courseRouter from "./routes/course_route.js"
import teacherRouter from "./routes/teacher_route.js"
import departmentRouter from "./routes/department_route.js"
import enrollmentRouter from "./routes/enrollment_route.js"
import { checkApiKeyInHeader, checkXRoleHeaderMiddle } from "./middleware/header_middleware.js"

dotenv.config()

const app=express()
const PORT = process.env.PORT || 3000


app.use(express.json())
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


app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})