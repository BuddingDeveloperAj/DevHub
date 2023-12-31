import { Schema, model, models, Document, ObjectId } from "mongoose";

export interface IQuestion extends Document {
  author: string;
  content: string;
  question: ObjectId;
  upvotes: ObjectId[];
  downvotes: ObjectId[];
  createdAt: Date;
}

const AnswerSchema = new Schema(
  {
    content: { type: String, required: true },
    question: { type: Schema.Types.ObjectId, ref: "Question" },
    upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Schema.Types.Date, default: Date.now },
  },
  { timestamps: true }
);

const Answer = models.Answer || model("Answer", AnswerSchema);

export default Answer;
