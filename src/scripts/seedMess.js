import mongoose from "mongoose";
import dotenv from "dotenv";
import Mess from "../models/Mess.model.js";

dotenv.config();

const seedMess = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Mess.insertMany([
      { name: "Boys Mess A", type: "BOYS" },
      { name: "Girls Mess B", type: "GIRLS" },
      { name: "Mega Mess", type: "BOYS" },
    ]);

    console.log("Mess data seeded successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedMess();
