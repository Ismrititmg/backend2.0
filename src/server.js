import express from "express"
import dotenv from "dotenv"

import studentRouter from "./routes/student_route.js"
import courseRouter from "./routes/course_route.js"
import teacherRouter from "./routes/teacher_route.js"
import departmentRouter from "./routes/department_route.js"
import enrollmentRouter from "./routes/enrollment_route.js"

dotenv.config()

const app=express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.use("/students", studentRouter)
app.use("/courses",courseRouter)
app.use("/teacher",teacherRouter)
app.use("/department",departmentRouter)
app.use("/enrollment",enrollmentRouter)

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})