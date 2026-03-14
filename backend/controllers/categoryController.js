import { Filter } from "bad-words";
import Category from "../models/categoryModel.js";

const filter = new Filter();

export const createCategory = async (req, res) => {
  try {
    let { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "CATEGORY NAME REQUIRED" });
    }

    name = name.trim();

    if (name.length > 30) {
      return res.status(400).json({ error: "CATEGORY NAME TOO LONG (MAX 30)" });
    }

    if (filter.isProfane(name)) {
      return res.status(400).json({ error: "THAT WORD IS NOT ALLOWED" });
    }

    const existing = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (existing) {
      // Return the existing one so the frontend can use its canonical name
      return res.status(200).json(existing);
    }

    const category = new Category({ name });
    await category.save();

    res.status(201).json(category);
  } catch (error) {
    console.log("ERROR IN CATEGORYCONTROLLER:", error.message);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json(categories);
  } catch (error) {
    console.log("ERROR IN CATEGORYCONTROLLER:", error.message);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};
