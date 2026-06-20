import {
  createCourse,
  FindAllCourses,
  findCourseById,
  updateCourse,
  deleteCourse,
} from "../handlers/course_handler.js";
import { Router } from "express";
let router = Router();

router.get("/", FindAllCourses);
router.get("/:id", findCourseById);
router.post("/", createCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

export default router;
