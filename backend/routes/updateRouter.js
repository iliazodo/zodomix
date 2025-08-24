import express from "express";

import { updateUserMsg } from "../controllers/updateController.js";

const router = express.Router();

router.post("/updateUserMsg", updateUserMsg);

export default router;
