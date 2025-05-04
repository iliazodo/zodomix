import expres from "express";
import { signup , login , logout } from "../controllers/authController.js";

const router = expres.Router();

router.post("/signup" , signup);
router.post("/login" , login);
router.post("/logout" , logout);

export default router;