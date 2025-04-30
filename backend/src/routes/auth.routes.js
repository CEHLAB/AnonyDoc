import { Router } from "express";
import {
  register,
  login,
  logout,
  me,
  updateEmail,
  updatePassword,
  deleteAccount,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  registerValidation,
  loginValidation,
} from "../middlewares/validate.middleware.js";

const router = Router();

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.post("/logout", logout);
router.get("/me", requireAuth, me);
router.put("/update-email", requireAuth, updateEmail);
router.put("/update-password", requireAuth, updatePassword);
router.delete("/delete-account", requireAuth, deleteAccount);

export default router;
