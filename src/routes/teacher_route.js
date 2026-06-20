import { getAllStudentsWithSelect } from "../handlers/student_handler.js";
import {
  FindAllTeachers,
  findTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  createTeacherWithDepartment,
  getAllTeachersWithSelect,
} from "../handlers/teacher_handler.js";
import {Router} from "express"

let router = Router()
router.get("/", FindAllTeachers)
router.get("/single/:id", findTeacherById)
router.get("/select",getAllTeachersWithSelect)
router.post("/",createTeacher)
router.post("/with-depart",createTeacherWithDepartment)
router.put("/:id",updateTeacher)
router.delete("/:id",deleteTeacher)

export default router