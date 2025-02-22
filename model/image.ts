import mongoose from "mongoose";

const ImageScehma = new mongoose.Schema(
  {
    userEmail: { type: String, required: true, index: true },
    userName: String,
    name: String,
    url: String,
  },
  { timestamps: true }
);


const Image = mongoose.models.Image || mongoose.model("Image",ImageScehma)

export {Image}

