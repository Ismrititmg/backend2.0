import { Router } from "express";
import { login, registerUserHandler } from "../handlers/auth_handler.js";

const router = Router();

router.post("/register", registerUserHandler);
router.post("/login", login);

export default router;
