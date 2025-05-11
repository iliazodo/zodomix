import express from "express";

import { createGroup, getGroup } from "../controllers/groupController.js";

const router = express.Router();

router.post("/create" , createGroup);

router.get("/get" , getGroup);

export default router;