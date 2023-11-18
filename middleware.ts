import { authMiddleware } from "@clerk/nextjs";
export default authMiddleware({
  // "/" will be accessible to all users
  publicRoutes: ["/", "/ask-question"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
