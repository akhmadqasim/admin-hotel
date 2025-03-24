import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials"

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
        if (credentials.email === "admin") {
          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          return {
            name: "Admin",
          }
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