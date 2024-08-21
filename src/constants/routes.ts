export const LinkLockerHomepage = "/";
export const LinkLockerSignUpPage = "/sign-up";
export const LinkLockerSignInPage = "/sign-in";
export const LinkLockerProfileRoute = "/profile";
export const LinkLockerPrivateLinkRoute = "/private-link";
export const KritanGithubProfile = "https://github.com/kritan560";
export const StagingOauth = "/staging-oauth";
export const LinkLockerLogoutPage = "/logout";
export const LinkLockerLinkTablePage = "/link-table";
export const LinkLockerExtensionLink =
  "https://drive.google.com/drive/folders/1R91HMEwPCafgjCCGYFBEVQXR7BY3SU7H?usp=sharing";
/**
 * @constant LinkLockerVerifyUserPage
 *
 * this constant doesn't do anything on it's own.
 *
 * hash and OTP must be provided in URL to make this route work on
 *
 * although it is here to manage a route in middleware
 */
export const LinkLockerVerifyUserPage = "/verify-user";

/**
 * route that can only be access when user is logged in
 *
 * logged-out user can't access this routes
 */
export const AuthenticatedRoutes = [
  LinkLockerHomepage,
  LinkLockerProfileRoute,
  LinkLockerPrivateLinkRoute,
  StagingOauth,
  LinkLockerLogoutPage,
  LinkLockerLinkTablePage,
];

/**
 * route that can only be access when user is not logged in
 *
 * logged-in user can't access this route
 */
export const UnauthenticatedRoutes = [
  LinkLockerSignInPage,
  LinkLockerSignUpPage,
];

/**
 * route that can be access via both logged-in and logged out user
 */
export const HybridRoute = [LinkLockerVerifyUserPage];
