import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials"

// Import Prisma
import {prisma} from "@/helper/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },

      authorize: async (credentials) => {
        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials?.email.toString(),
              password: credentials?.password.toString(),
            },
          })

          if (!user) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: 'admin',
          }
        } catch (error) {
          return null
        }

        return null
      },
    }),
  ],
  pages: {
    signOut: '/login',
    signIn: '/login',
  }
});