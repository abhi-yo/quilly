import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      // Handle the update case
      if (trigger === "update" && session?.user) {
        console.log("JWT Update triggered with session:", session);
        // Update token with the new session data
        token.name = session.user.name;
        // Verify the update in database
        await connectToDatabase();
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser && dbUser.name !== token.name) {
          // Update database if needed
          await User.updateOne(
            { email: token.email },
            { $set: { name: token.name } }
          );
        }
        console.log("JWT token updated with name:", token.name);
        return token;
      }

      if (account && user) {
        console.log("[JWT Callback] Initial sign-in triggered.");
        console.log("[JWT Callback] Provider User:", user);
        await connectToDatabase();
        const dbUser = await User.findOne({ email: user.email });
        console.log("[JWT Callback] DB User found:", dbUser);
        
        if (!dbUser) {
          console.log("[JWT Callback] Creating new user.");
          const newUser = await User.create({
            email: user.email,
            name: user.name,
            role: "user", // Default role
          });
          console.log("[JWT Callback] New user created:", newUser);
          token.role = "user";
          token.id = newUser._id;
          token.name = user.name;
        } else {
          console.log("[JWT Callback] Existing user found.");
          token.role = dbUser.role;
          token.id = dbUser._id;
          token.name = dbUser.name; // Sets token name from DATABASE record
          console.log("[JWT Callback] Token name set from DB User:", token.name);
        }
      }
      console.log("[JWT Callback] Returning token:", token);
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
        session.user.name = token.name;

        // Log session update
        console.log('Session updated with name:', session.user.name);
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signup",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
};

// Extend next-auth types to include role
declare module "next-auth" {
  interface User {
    role: string;
    id: string;
  }
  
  interface Session {
    user: {
      id: string;
      role: string;
      email: string;
      name?: string | null;
      image?: string | null;
    }
  }

  interface JWT {
    role: string;
    id: string;
    email?: string;
  }
} 