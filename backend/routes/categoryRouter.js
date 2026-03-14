import express from "express";
import { createCategory, getCategories } from "../controllers/categoryController.js";

const router = express.Router();

// POST /api/category/create  — open (used by seed script / admin)
router.post("/create", createCategory);

// GET /api/category/get  — public
router.get("/get", getCategories);

export default router;
