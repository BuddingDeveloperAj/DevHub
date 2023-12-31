import { Schema, model, models, Document, ObjectId } from "mongoose";

export interface IQuestion extends Document {
  title: string;
  content: string;
  tags: ObjectId[];
  views: number;
  upvotes: ObjectId[];
  downvotes: ObjectId[];
  answers: ObjectId[];
  author: ObjectId;
  createdAt: Date;
}

const QuestionSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    views: { type: Number, default: 0 },
    upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    answers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Schema.Types.Date, default: Date.now },
  },
  { timestamps: true }
);

const Question = models.Question || model("Question", QuestionSchema);

export default Question;
