import Link from "next/link";
import { Button } from "@/components/ui/button";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import Filter from "@/components/shared/Filter";
import { HomePageFilters } from "@/constants/filter";
import HomeFilters from "@/components/Home/HomeFilters";
import NoResult from "@/components/shared/NoResult";
import QuestionCard from "@/components/shared/cards/QuestionCard";

const questions = [
  {
    _id: "1",
    title: "How to optimize website performance in React?",
    tags: [
      { _id: "101", name: "React" },
      { _id: "102", name: "Performance" },
    ],
    author: {
      _id: "201",
      name: "John Doe",
      picture: "url_to_picture_1",
    },
    views: 1200,
    upvotes: 28,
    answers: [
      { response: "This is an answer", user: "SomeUser" },
      { response: "Another answer here", user: "AnotherUser" },
    ],
    createdAt: new Date("2023-11-14T09:00:00.000Z"),
  },
  {
    _id: "2",
    title: "Best practices for responsive web design?",
    tags: [
      { _id: "103", name: "Responsive Design" },
      { _id: "104", name: "CSS" },
    ],
    author: {
      _id: "202",
      name: "Jane Smith",
      picture: "url_to_picture_2",
    },
    views: 1800,
    upvotes: 45,
    answers: [],
    createdAt: new Date("2023-11-14T09:00:00.000Z"),
  },
  {
    _id: "3",
    title: "How to implement authentication in Node.js?",
    tags: [
      { _id: "105", name: "Node.js" },
      { _id: "106", name: "Authentication" },
    ],
    author: {
      _id: "203",
      name: "Alex Johnson",
      picture: "url_to_picture_3",
    },
    views: 950,
    upvotes: 34,
    answers: [
      { response: "Authentication can be done using...", user: "SomeUser" },
    ],
    createdAt: new Date("2023-11-14T09:00:00.000Z"),
  },
  {
    _id: "4",
    title: "What are the best resources to learn JavaScript?",
    tags: [
      { _id: "107", name: "JavaScript" },
      { _id: "108", name: "Learning" },
    ],
    author: {
      _id: "204",
      name: "Sarah Brown",
      picture: "url_to_picture_4",
    },
    views: 1500,
    upvotes: 20000255,
    answers: [
      { response: "Some great resources include...", user: "AnotherUser" },
    ],
    createdAt: new Date("2023-06-14T09:00:00.000Z"),
  },
  {
    _id: "5",
    title: "How to optimize a website for SEO?",
    tags: [
      { _id: "109", name: "SEO" },
      { _id: "110", name: "Web Development" },
    ],
    author: {
      _id: "205",
      name: "Michael Clark",
      picture: "url_to_picture_5",
    },
    views: 2000,
    upvotes: 60,
    answers: [],
    createdAt: new Date("2023-11-14T09:00:00.000Z"),
  },
];

export default function Home() {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900 ">
            Ask a Question
          </Button>
        </Link>
      </div>
      <div className="mt-5 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          imgSrc="/assets/icons/search.svg"
          placeholder=" Search for Questions"
          iconPosition="left"
          route="/"
          otherClasses="flex-1"
        />
        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>
      <HomeFilters />

      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There's no question to show"
            description="Join the conversation! Break the silence and ask the first question. Be
          the trendsetter in our community."
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
}
