import { Router } from "express";
import { login, register } from "../controllers/authController.js";
const router = Router();
///in this place u can do some rbac controllers
router.post("/register", register);
router.post("/login", login);

export default router;
