import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "../db/client";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@yellowribbontravels.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const result = await db.execute({
            sql: "SELECT id, email, password_hash, name, phone, role, department, branch_id, is_active FROM users WHERE email = ? LIMIT 1",
            args: [credentials.email.trim().toLowerCase()],
          });

          const user = result.rows[0];
          if (!user) {
            return null;
          }

          // Check if account has been suspended/deactivated
          if (Number(user.is_active) === 0) {
            console.warn(`Sign-in rejected for inactive user: ${user.email}`);
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            String(user.password_hash)
          );

          if (!isValid) {
            return null;
          }

          return {
            id: String(user.id),
            email: String(user.email),
            name: String(user.name),
            phone: user.phone ? String(user.phone) : "",
            role: String(user.role),
            department: user.department ? String(user.department) : null,
            branch_id: user.branch_id ? String(user.branch_id) : null,
          };
        } catch (error) {
          console.error("Auth authorize error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/account/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.phone = user.phone;
        token.department = user.department;
        token.branch_id = user.branch_id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) || "client";
        session.user.phone = token.phone as string | null;
        session.user.department = token.department as string | null;
        session.user.branch_id = token.branch_id as string | null;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "yrt_fallback_secret_key_yellow_ribbon_2026",
};
