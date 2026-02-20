import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/login" },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/quiz/:path*",
    "/accounting-drag/:path*",
    "/simulation/:path*",
    "/dcf/:path*",
  ],
};
