import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";

const TRIAL_DAYS = parseInt(process.env.TRIAL_DAYS || "7", 10);

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days — how long a login stays valid
    updateAge: 24 * 60 * 60,   // refresh the session token once per day of activity
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/login", // failed Google sign-ins land on the login page with a friendly message
  },
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });
        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, name: user.name, email: user.email, role: user.role } as any;
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Google sign-in: find or create a matching row in our own User table,
      // keyed by email — no separate NextAuth adapter/tables involved.
      if (account?.provider === "google" && user?.email) {
        const email = user.email.toLowerCase().trim();
        let dbUser = await prisma.user.findUnique({ where: { email } });

        if (!dbUser) {
          const unusablePassword = await bcrypt.hash(randomUUID(), 10); // Google users never use password login
          dbUser = await prisma.user.create({
            data: {
              name: user.name || null,
              email,
              passwordHash: unusablePassword,
              trialEndsAt: new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000),
              subscriptionStatus: "trialing",
            },
          });
          sendWelcomeEmail(dbUser.email, dbUser.name, TRIAL_DAYS).catch((err) => console.error("Welcome email failed:", err));
        }

        token.id = dbUser.id;
        token.role = dbUser.role;
        return token;
      }

      if (user) { token.id = (user as any).id; token.role = (user as any).role; }
      // Sessions created before role was stored: look it up once.
      if (token.id && token.role === undefined) {
        const u = await prisma.user.findUnique({ where: { id: token.id as string }, select: { role: true } });
        token.role = u?.role || "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role || "user"; // used only to show/hide the Admin link; the admin page re-checks the database
      }
      return session;
    },
  },
};
