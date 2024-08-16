import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credential from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import prisma from "../prisma/db";
import { LinkLockerSignInPage, StagingOauth } from "./constants/routes";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
  pages: { signIn: LinkLockerSignInPage, newUser: StagingOauth },
  cookies: {},

  providers: [
    GitHub({ allowDangerousEmailAccountLinking: true }),

    Google({ allowDangerousEmailAccountLinking: true }),

    Credential({
      credentials: {
        email: { label: "Email", type: "email", placeholder: "enter email" },
        password: {
          label: "password",
          type: "password",
          placeholder: "******",
        },
      },

      authorize: async (credentials) => {
        let user = null;

        // if email or password not provided return null
        if (!credentials.email || !credentials.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // logic to verify if the user exists
        user = await prisma.user.findUnique({ where: { email } });

        if (!user || !user.hashedPassword) {
          // No user found, so this is their first attempt to login
          // meaning this is also the place you could do registration
          // registeration should be done in seperate route because you can ask for other details there. only the username and password are provided here for login purpose
          return null;
        }

        const verifyPassword = await bcrypt.compare(
          password,
          user.hashedPassword
        );

        // password is not verifed : user entered the wrong password.
        if (!verifyPassword) {
          return null;
        }

        // return user object with their profile data
        return user;
      },

      type: "credentials",
    }),
  ],

  callbacks: {
    // you can only get the detail of account during sign-in
    jwt({ token, account }) {
      if (account?.type === "credentials") {
        token.type = "credentials";
      }

      if (account?.type === "oauth") {
        token.type = "oauth";
      }

      return token;
    },

    session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
        session.user.type = token.type;
      }
      return session;
    },
  },

  events: {
    linkAccount: async ({ user }) => {
      if (user.email && user.id) {
        await prisma.user.update({
          data: { emailVerified: new Date() },
          where: { email: user.email },
        });
      }
    },
  },
});
