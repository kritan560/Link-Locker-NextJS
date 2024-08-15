import { auth } from "@/auth";
import { NextResponse } from "next/server";
import {
  AuthenticatedRoutes,
  LinkLockerSignInPage,
  UnauthenticatedRoutes,
} from "./constants/routes";
import { env } from "./env";

const allowedOrigins = [env.EXTENSION_URL_PROD, env.EXTENSION_URL];

const corsOptions = {
  // enabling this to 'true' Access-Control-Allow-Credentials will only allow to work with CORS and credentials. Here i face a problem with my chrome extension unable to communicate to nextjs backend that should access the session of logged in user enabling this and restarting the server works for me
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export default auth((request) => {
  const { nextUrl } = request;

  // is user logged in
  const isLoggedIn = !!request.auth;

  // current request route
  const currentRoute = nextUrl.pathname;

  // this const have to be created due to malperformed URL. in nextjs >12.1 you have to pass absolute url meaning : "/" or "/homepage" won't work
  const HomePage = nextUrl.origin;

  /* is current route is a part of Unauthenticated Route */
  const includeUnauthenticatedRoute =
    UnauthenticatedRoutes.includes(currentRoute);

  /**
   * is current route a part of Authenticated Route
   */
  const includeAuthenticatedRoute = AuthenticatedRoutes.includes(currentRoute);

  // if a part of Unauthenticated route redirect to signin page
  if (includeAuthenticatedRoute && !isLoggedIn) {
    return NextResponse.redirect(`${nextUrl.origin}${LinkLockerSignInPage}`);
  }

  // if a part of Unauthenticated route redirect to homepage
  if (isLoggedIn && includeUnauthenticatedRoute) {
    return NextResponse.redirect(HomePage);
  }

  // Below code is to check of CORS policy.
  // Check the origin from the request
  const origin = request.headers.get("origin") ?? "";
  const isAllowedOrigin = allowedOrigins.includes(origin);

  // Handle preflighted requests
  const isPreflight = request.method === "OPTIONS";

  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && { "Access-Control-Allow-Origin": origin }),
      ...corsOptions,
    };
    return NextResponse.json({}, { headers: preflightHeaders });
  }

  // Handle simple requests
  const response = NextResponse.next();

  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
});
