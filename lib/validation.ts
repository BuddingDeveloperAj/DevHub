import { z } from "zod";

export const questionSchema = z.object({
  title: z
    .string()
    .min(5, {
      message:
        "Your question needs a bit more detail. It's a title, not a tweet!",
    })
    .max(150, {
      message:
        "Slow down! Save some space for the description. Are you writing a novel?",
    }),
  explanation: z.string().min(100, {
    message:
      "Hey, expand on that! The description needs more words than a fortune cookie.",
  }),
  tags: z
    .array(z.string())
    .min(1, {
      message: "One tag at least, please! It gets lonely without any tags.",
    })
    .max(3, {
      message: "Easy there! Three tags are enough to describe the universe.",
    }),
});

export const answerSchema = z.object({
  answer: z.string().min(1),
});
