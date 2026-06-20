import {
  FindAllStudents,
  findStudentById,
  createStudent,
  deleteStudent,
  createStudentWithDepartment,
  sortStudents,
  updateStudent,
  getAllStudentsWithSelect,
} from "../handlers/student_handler.js";

import { Router } from "express";

let router = Router();

router.get("/", FindAllStudents);
router.get("/single/:id", findStudentById);
router.post("/", createStudent);
router.delete("/:id", deleteStudent);
router.get("/sort", sortStudents);
router.get("/with-select", getAllStudentsWithSelect);
router.get("/with-depart", createStudentWithDepartment);
router.put("/:id", updateStudent);

export default router;