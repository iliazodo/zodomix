import express from "express";

import { addFavGroup, createGroup, deleteGroup, getFavGroup, getGroup, getGroupInfo, getMyOwnGroups, sendPass, updateGroup } from "../controllers/groupController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/create" , protectRoute, createGroup);

router.get("/get" , getGroup);

router.get("/getMyGroups" , protectRoute , getMyOwnGroups);

router.post("/getGroupById" , getGroupInfo);

router.put("/update" , protectRoute , updateGroup);

router.delete("/delete" , protectRoute , deleteGroup);

router.post("/addFavorite" , protectRoute, addFavGroup );

router.get("/getFavorite" , protectRoute , getFavGroup);

router.post("/sendPass" , protectRoute , sendPass);

export default router;