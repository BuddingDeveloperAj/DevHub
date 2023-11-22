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
    tags: [{ type: Schema.Types.ObjectId, ref: "Tags" }],
    views: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    upvotes: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    downvotes: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    answers: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    author: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    createdAt: { type: Schema.Types.Date, default: Date.now },
  },
  { timestamps: true }
);

const Question = models.Question || model("Question", QuestionSchema);

export default Question;
