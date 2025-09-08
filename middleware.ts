export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/admin/:path*",
    "/(dashboard)/:path*",
    "/orders/:path*",
    "/purchases/:path*",
    "/topup/:path*",
    "/profile/:path*",
  ],
};
