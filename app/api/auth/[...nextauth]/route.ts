import NextAuth, { AuthOptions, Session as NextAuthSession, User as NextAuthUser } from "next-auth";
import { JWT as NextAuthJWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare, hash } from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { SessionStrategy } from "next-auth";

interface GoogleProfile {
  sub: string;
  name: string;
  email: string;
  picture: string;
}

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "8f4a9b2c7e1d6f3a8b9c2e5f7a4d1b6e9c3f8a2b5d7e1c4f9a6b3e8d2c5f7a1b4e",
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        console.log("[Authorize Callback] Running...");
        console.log("[Authorize Callback] Credentials:", credentials);
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter email and password");
        }

        const client = await clientPromise;
        const db = client.db();
        const user = await db.collection("users").findOne({ email: credentials.email });

        if (!user && !credentials.otp) {
          const hashedPassword = await hash(credentials.password, 12);
          const otp = Math.floor(100000 + Math.random() * 900000).toString();
          
          const newUser = await db.collection("users").insertOne({
            email: credentials.email,
            password: hashedPassword,
            role: credentials.role || "reader",
            emailVerified: null,
            createdAt: new Date(),
          });

          await db.collection("otps").insertOne({
            userId: newUser.insertedId,
            otp,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
          });

          console.log("OTP for", credentials.email, ":", otp);

          return {
            id: newUser.insertedId.toString(),
            email: credentials.email,
            role: credentials.role,
          };
        }

        if (user && credentials.otp) {
          const otpRecord = await db.collection("otps").findOne({
            userId: user._id,
            otp: credentials.otp,
            expiresAt: { $gt: new Date() },
          });

          if (!otpRecord) {
            throw new Error("Invalid or expired OTP");
          }

          await db.collection("users").updateOne(
            { _id: user._id },
            { $set: { emailVerified: new Date() } }
          );

          await db.collection("otps").deleteOne({ _id: otpRecord._id });

          const authorizedUser = {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            name: user.name,
          };
          console.log("[Authorize Callback] Returning OTP verified user:", authorizedUser);
          return authorizedUser;
        }

        if (user && !credentials.otp) {
          const isPasswordValid = await compare(credentials.password, user.password);
          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }

          const authorizedUser = {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            name: user.name,
          };
          console.log("[Authorize Callback] Returning logged in user:", authorizedUser);
          return authorizedUser;
        }

        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("[SignIn Callback] Running...");
      console.log("[SignIn Callback] User:", user);
      console.log("[SignIn Callback] Account:", account);
      
      if (account?.provider === "google") {
        try {
          const client = await clientPromise;
          const db = client.db();
          
          const existingUser = await db.collection("users").findOne({ email: user.email });
          
          if (!existingUser) {
            const result = await db.collection("users").insertOne({
              email: user.email,
              name: user.name,
              image: user.image,
              role: "pending",
              emailVerified: new Date(),
              createdAt: new Date(),
              provider: "google",
              googleId: user.id,
              needsRoleSelection: true,
            });
            user.id = result.insertedId.toString();
            user.role = "pending";
            console.log("[SignIn Callback] Created new Google user - needs role selection");
            return "/auth/complete-profile?provider=google";
          } else {
            await db.collection("users").updateOne(
              { email: user.email },
              { 
                $set: { 
                  name: user.name || existingUser.name,
                  image: user.image || existingUser.image,
                  emailVerified: existingUser.emailVerified || new Date(),
                  googleId: user.id,
                }
              }
            );
            user.id = existingUser._id.toString();
            user.role = existingUser.role || "reader";
            console.log("[SignIn Callback] Updated existing user with Google info");
          }
        } catch (error) {
          console.error("[SignIn Callback] Error handling Google user:", error);
          return false;
        }
      }
      
      return true;
    },
    async jwt({ token, user }) {
      console.log("[JWT Callback] Running...");
      console.log("[JWT Callback] Input User:", user);
      console.log("[JWT Callback] Input Token:", token);
      
      if (user) {
        token.id = user.id;
        token.role = user.role || "reader";
        token.name = user.name;
        console.log("[JWT Callback] Token updated with user info.");
      } else if (token.role === "pending") {
        try {
          const client = await clientPromise;
          const db = client.db();
          const dbUser = await db.collection("users").findOne({ email: token.email });
          if (dbUser && dbUser.role !== "pending") {
            token.role = dbUser.role;
            console.log("[JWT Callback] Updated pending role to:", dbUser.role);
          }
        } catch (error) {
          console.error("[JWT Callback] Error checking role update:", error);
        }
      }
      console.log("[JWT Callback] Returning Token:", token);
      return token;
    },
    async session({ session, token }) {
      console.log("[Session Callback] Running...");
      console.log("[Session Callback] Input Token:", token);
      console.log("[Session Callback] Input Session:", session);
      if (session.user && token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.name = token.name;
        console.log("[Session Callback] Session user updated with token info.");
      }
      console.log("[Session Callback] Returning Session:", session);
      return session;
    },
  },
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 7 * 24 * 60 * 60,
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };