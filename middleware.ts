import { authMiddleware } from "@clerk/nextjs";
export default authMiddleware({
  // "/" will be accessible to all users
  publicRoutes: [
    "/",
    "/api/webhook",
    "/ask-question",
    "/question/:id",
    "/tags",
    "/tags/:id",
    "/profile/:id",
    "/community",
    "/jobs",
  ],
  ignoredRoutes: ["/api/webhook", "/api/chatgpt"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
