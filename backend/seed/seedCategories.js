import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

// Import model after dotenv
const categorySchema = new mongoose.Schema(
  { name: { type: String, required: true, unique: true, trim: true } },
  { timestamps: true }
);
const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

const CATEGORIES = [
  // — Your requested —
  "Tech",
  "News",
  "Just Chat",
  "Hang Out",
  "Computer",
  "AI",
  "Crypto",
  "Trading",
  "Art",
  "Question",
  "Book",
  "Cooking",
  "Team",
  "Music",
  "Nature",
  "Animals",
  "Python",
  "C++",
  "C",
  "Rust",
  "HTML",
  "CSS",
  "Javascript",
  "Game",
  "Poetry",
  // — Tech additions —
  "Science",
  "Math",
  "Philosophy",
  "History",
  "Movies & TV",
  "Sports",
  "Health & Fitness",
  "Finance",
  "Language Learning",
  "Photography",
  "Design & UI",
  "Anime & Manga",
  "Travel",
  "Humor & Memes",
  "Cybersecurity",
  "Database",
  "DevOps",
  "Career & Jobs",
  "Startups",
  "Writing",
  "Robotics",
  "3D & Animation",
  // — 50 general categories —
  "Fashion & Style",
  "Food & Drinks",
  "Fitness & Gym",
  "Mental Health",
  "Relationships",
  "Parenting",
  "Religion & Spirituality",
  "Politics",
  "Economics",
  "Law & Justice",
  "Environment",
  "DIY & Crafts",
  "Home & Interior",
  "Cars & Vehicles",
  "Motorcycles",
  "Cycling",
  "Hiking",
  "Football",
  "Basketball",
  "Tennis",
  "Chess",
  "Board Games",
  "Astronomy",
  "Physics",
  "Chemistry",
  "Biology",
  "Medicine",
  "Psychology",
  "Sociology",
  "Architecture",
  "Farming",
  "Marine Life",
  "Birds",
  "Gardening",
  "Woodworking",
  "Makeup & Beauty",
  "Dancing",
  "Theater",
  "Stand-Up Comedy",
  "Podcasts",
  "Vinyl & Analog",
  "Comics",
  "Tattoo & Body Art",
  "Jewelry & Accessories",
  "Camping",
  "Surfing",
  "Martial Arts",
  "Yoga & Meditation",
  "Volunteering",
  "Skateboarding",
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("Connected to MongoDB");

    let created = 0;
    let skipped = 0;

    for (const name of CATEGORIES) {
      const exists = await Category.findOne({ name });
      if (exists) {
        skipped++;
        continue;
      }
      await Category.create({ name });
      created++;
      console.log(`  ✓ Created: ${name}`);
    }

    console.log(`\nDone! Created: ${created} | Skipped (already exist): ${skipped}`);
  } catch (error) {
    console.error("Seed error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

seed();
