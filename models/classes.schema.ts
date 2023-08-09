import mongoose from "mongoose";

const Schema = mongoose.Schema;

const classSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  classIcon: {
    data: Buffer,
    contentType: String,
  },
  classHero: {
    data: Buffer,
    contentType: String,
  },
  skills: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "Skills",
      },
      title: String,
    },
  ],
});

export default mongoose.model("Classes", classSchema);
