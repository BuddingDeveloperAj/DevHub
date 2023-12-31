"use client";

import { Editor } from "@tinymce/tinymce-react";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeProvider";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { answerSchema } from "@/lib/validation";
import Image from "next/image";
import { createAnswer } from "@/lib/actions/answer.action";
import { usePathname } from "next/navigation";
import { toast } from "../ui/use-toast";

interface Props {
  authorId: string;
  questionId: string;
  question: string;
}

const Answer = ({ authorId, questionId, question }: Props) => {
  const pathname = usePathname();
  const [isSubmittingAI, setIsSubmittingAI] = useState(false);

  const form = useForm<z.infer<typeof answerSchema>>({
    resolver: zodResolver(answerSchema),
    defaultValues: {
      answer: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const editorRef = useRef();

  const onSubmit = async (values: z.infer<typeof answerSchema>) => {
    setIsSubmitting(true);

    // Use regular expression to find and replace text within triple backticks
    const content = values.answer.replace(/```(.*?)```/gs, "<code>$1</code>");

    try {
      await createAnswer({
        content,
        author: JSON.parse(authorId),
        question: JSON.parse(questionId),
        path: pathname,
      });

      form.reset();

      if (editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent("");
      }
      setEditorContent("");
      toast({
        title: "Answer submitted successfully",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error while submitting answer",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const [editorKey, setEditorKey] = useState(0);
  const [editorContent, setEditorContent] = useState("");

  const toggleMode = () => {
    setEditorKey((prevKey) => prevKey + 1);
  };

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
  };

  const { mode } = useTheme();
  useEffect(() => {
    handleEditorChange(form.getValues("answer"));
    toggleMode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const generateAIAnswer = async () => {
    if (!authorId) return;
    setIsSubmittingAI(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/chatgpt`,
        {
          method: "POST",
          body: JSON.stringify({ query: question }),
        }
      );

      const aiAnswer = await response.json();
      const formattedAnswer = aiAnswer.reply.replace(/\n/g, "<br />");

      if (editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent(formattedAnswer);
      }
      toast({
        title: "AI Generated answer successfully",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Oops! Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingAI(false);
    }
  };

  return (
    <div>
      <div className="mb-2 flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Unleash Your Genius: Share Your Answer ✨!
        </h4>
        <Button
          onClick={generateAIAnswer}
          className="btn light-border-2 gap-1.5 rounded-md px-4 py-2.5 text-primary-500 shadow-none"
        >
          {isSubmittingAI ? (
            <>Generating...</>
          ) : (
            <>
              <Image
                src="/assets/icons/stars.svg"
                alt="start"
                width={12}
                height={12}
                className="object-contain"
              />
              Generate an AI Answer
            </>
          )}
        </Button>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-10"
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormControl className="mt-3.5">
                  <Editor
                    key={editorKey}
                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                    // @ts-ignore
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    init={{
                      toolbar_mode: "sliding",
                      menubar: false,
                      plugins:
                        "autolink codesample emoticons image link media  table visualblocks",
                      toolbar:
                        "undo redo blocks codesample fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons ",
                      content_style:
                        "body { font-size:16px; font-family:Inter; } ",
                      placeholder: "Elaborate your question here.",
                      skin: mode === "dark" ? "oxide-dark" : "oxide",
                      content_css: mode === "dark" ? "dark" : "light",
                    }}
                    initialValue={editorContent}
                    onBlur={field.onBlur}
                    onEditorChange={(content) => field.onChange(content)}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="primary-gradient w-fit !text-light-900"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Answer;
