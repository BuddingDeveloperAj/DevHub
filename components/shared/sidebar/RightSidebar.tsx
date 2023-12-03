import Link from "next/link";
import Image from "next/image";
import React from "react";
import RenderTag from "../Badge";

const topQuestions = [
  {
    _id: "1",
    question: "How do I implement authentication in my React app?",
  },
  {
    _id: "2",
    question:
      "What are the best practices for deploying a Node.js application?",
  },
  {
    _id: "3",
    question:
      "How can I optimize performance in a large-scale React application?",
  },
  {
    _id: "4",
    question: "How do I implement authentication in my React app?",
  },
  {
    _id: "5",
    question:
      "What are the best practices for deploying a Node.js application?",
  },
];

const popularTags = [
  {
    _id: "1",
    name: "JavaScript",
    totalQuestions: 12,
  },
  {
    _id: "2",
    name: "Python",
    totalQuestions: 8,
  },
  {
    _id: "3",
    name: "HTML",
    totalQuestions: 6,
  },
  {
    _id: "4",
    name: "CSS",
    totalQuestions: 7,
  },
  {
    _id: "5",
    name: "Node.js",
    totalQuestions: 9,
  },
];

const RightSidebar = () => {
  return (
    <section
      className="background-light900_dark200
     light-border custom-scrollbar sticky right-0 top-0 flex h-screen w-[350px] 
     flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 
     dark:shadow-none max-xl:hidden"
    >
      <div className="pt-3">
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-3">
          {topQuestions.map((item) => {
            return (
              <Link
                href={`/questions/${item._id}`}
                key={item._id}
                className="flex cursor-pointer items-center justify-between gap-7 rounded-lg p-2 hover:bg-orange-50 dark:hover:bg-gray-900"
              >
                <p className="body-medium text-dark500_light700">
                  {item.question}
                </p>
                <Image
                  src="/assets/icons/chevron-right.svg"
                  alt="chevron right"
                  width={20}
                  height={20}
                  className="invert-colors"
                />
              </Link>
            );
          })}
        </div>
      </div>
      <div className="mt-10">
        <p className="h2-bold text-dark300_light900">Popular Tags</p>
        <div className="mt-2 flex flex-row flex-wrap gap-2">
          {popularTags.map((item) => {
            return (
              <RenderTag
                key={item._id}
                _id={item._id}
                name={item.name}
                totalQuestions={item.totalQuestions}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
