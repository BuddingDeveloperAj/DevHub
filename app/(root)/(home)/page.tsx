import Link from "next/link";
import { Button } from "@/components/ui/button";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";

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
        Filter
      </div>
    </>
  );
}
