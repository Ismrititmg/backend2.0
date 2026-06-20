import { Router } from "express";
let router = Router();
import {
  createEnrollment,
  findEnrollmentById,
  FindAllEnrollments,
  updateEnrollment,
  deleteEnrollment,
} from "../handlers/enrollment_handler.js";

router.get("/", FindAllEnrollments);
router.get("/:id", findEnrollmentById);
router.post("/", createEnrollment);
router.put("/:id", updateEnrollment);
router.delete("/:id", deleteEnrollment);

export default router;