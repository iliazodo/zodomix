import express from "express";

import { addUser } from "../controllers/userController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/addUserToGroup" , protectRoute, addUser);

export default router;