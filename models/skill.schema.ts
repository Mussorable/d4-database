import mongoose from "mongoose";

const Schema = mongoose.Schema;

const skillSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  img: {
    data: Buffer,
    contentType: String,
  },
});

export default mongoose.model("Skills", skillSchema);
