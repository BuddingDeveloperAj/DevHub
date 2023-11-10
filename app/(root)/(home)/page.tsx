import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <p>hellooo</p>
      <UserButton afterSignOutUrl="/sign-in" />
    </div>
  );
}
