import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <UserButton afterSignOutUrl="/sign-in" />
      <p>hello there broooo</p>
      <h1 className="h1-bold">Hi broooo</h1>
    </div>
  );
}
