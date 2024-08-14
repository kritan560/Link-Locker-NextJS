import { getMillisecond } from "./get-millisecond";

/**
 * This function will check if the token is expired or not. checking under the parameter of 60minute
 * @param codeCreated - The code creation date
 * @returns
 */
export const IsUserVerificationTokenExpired = (codeCreated: Date) => {
  // is verification token expired?

  const tokenCreated = codeCreated;
  const tokenExpiredTime =
    tokenCreated && tokenCreated.getTime() + getMillisecond(60);
  const currentTime = new Date().getTime();
  const isVerificationTokenExpired = currentTime > tokenExpiredTime;
  return isVerificationTokenExpired;
};
