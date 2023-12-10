"use client";

import { Editor } from "@tinymce/tinymce-react";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { questionSchema } from "@/lib/validation";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeProvider";
interface Props {
  user: string;
  type?: string;
  questionDetails?: string;
}

const Question = ({ user, type, questionDetails }: Props) => {
  const editorRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const parsedQuesitonDetails = JSON.parse(questionDetails || "{}");
  const form = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: parsedQuesitonDetails?.title ?? "",
      explanation: parsedQuesitonDetails?.content ?? "",
      tags: parsedQuesitonDetails?.tags?.map((x: any) => x.name) ?? [],
    },
  });

  const [editorKey, setEditorKey] = useState(0);
  const [editorContent, setEditorContent] = useState("");

  const toggleMode = () => {
    setEditorKey((prevKey) => prevKey + 1);
    // Increment key to force re-render
  };

  // Update editor content when it changes
  const handleEditorChange = (content: string) => {
    setEditorContent(content);
  };

  const { mode } = useTheme();
  useEffect(() => {
    handleEditorChange(form.getValues("explanation"));
    toggleMode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  async function onSubmit(values: z.infer<typeof questionSchema>) {
    setIsSubmitting(true);
    try {
      if (type === "edit") {
        await editQuestion({
          questionId: parsedQuesitonDetails._id,
          title: values.title,
          content: values.explanation,
          path: pathname,
        });
        router.push(`/question/${parsedQuesitonDetails._id}`);
      } else {
        await createQuestion({
          title: values.title,
          content: values.explanation,
          tags: values.tags,
          author: JSON.parse(user),
          path: pathname,
        });
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleTagRemover = (tag: string, field: any) => {
    const newTags = field.value.filter((t: string) => t !== tag);
    form.setValue(
      "tags",
      newTags.sort((a: string, b: string) => a.localeCompare(b))
    );
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    if (e.key === "Enter" && field.name === "tags") {
      e.preventDefault();
      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value.trim();

      if (tagValue !== "") {
        if (tagValue.length > 15) {
          return form.setError("tags", {
            type: "required",
            message: "Tag must be less than 15 characters",
          });
        } else if (tagValue.length < 2) {
          return form.setError("tags", {
            type: "required",
            message: "Tag must be more than a character",
          });
        }

        if (!field.value.includes(tagValue as never)) {
          form.setValue(
            "tags",
            [...field.value, tagValue].sort((a, b) => a.localeCompare(b))
          );
          tagInput.value = "";
          form.clearErrors("tags");
        } else {
          tagInput.value = "";
          form.clearErrors("tags");
        }
      }
      // else {
      //   form.trigger();
      // }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question Title<span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  placeholder=" Question..."
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Be specific and imagine you&apos;re asking a question to another
                person.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800 gap-3">
                Detailed explanation of your problem.
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Editor
                  key={editorKey}
                  apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                  // @ts-ignore
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  init={{
                    menubar: false,
                    plugins:
                      "anchor autolink codesample emoticons image link lists media  table visualblocks",
                    toolbar:
                      "undo redo | blocks codesample fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons ",
                    content_style:
                      "body { font-size:16px; font-family:Inter; } ",
                    placeholder: "Elaborate your question here.",
                    skin: mode === "dark" ? "oxide-dark" : "oxide",
                    content_css: mode === "dark" ? "dark" : "",
                  }}
                  initialValue={editorContent}
                  onBlur={field.onBlur}
                  onEditorChange={(content) => {
                    field.onChange(content);
                  }}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Tags<span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <>
                  <Input
                    onKeyDown={(e) => handleKeyDown(e, field)}
                    disabled={type === "edit"}
                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                    placeholder=" Add tags..."
                  />
                  {field.value.length > 0 && (
                    <div className="flex-start mt-2.5 gap-2.5">
                      {field.value.map((tag: any) => (
                        <Badge
                          key={tag}
                          className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize"
                        >
                          {tag}
                          {type !== "edit" && (
                            <Image
                              src="/assets/icons/close.svg"
                              alt="close icon"
                              width={12}
                              height={12}
                              onClick={() => handleTagRemover(tag, field)}
                              className="cursor-pointer object-contain invert-0 dark:invert"
                            />
                          )}
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Add up to 3 tags to describe what your question is about. You
                need to press enter to add a tag.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="primary-gradient w-fit !text-light-900"
        >
          {isSubmitting ? (
            <>{type === "edit" ? "Editing..." : "Posting..."}</>
          ) : (
            <>{type === "edit" ? "Edit Question" : "Ask a Question"}</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default Question;
