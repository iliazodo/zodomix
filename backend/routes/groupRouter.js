import express from "express";

import { addFavGroup, createGroup, getFavGroup, getGroup } from "../controllers/groupController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/create" , createGroup);

router.get("/get" , getGroup);

router.post("/addFavorite" , protectRoute, addFavGroup );

router.get("/getFavorite" , protectRoute , getFavGroup);

export default router;