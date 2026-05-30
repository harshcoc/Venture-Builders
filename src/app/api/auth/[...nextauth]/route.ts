import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

/**
 * NextAuth configuration with DummyJSON Credentials Provider.
 * The authorize function calls the DummyJSON login API and returns
 * user data + accessToken which are stored in the JWT.
 */
const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const res = await fetch('https://dummyjson.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
              expiresInMins: 60,
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            return null;
          }

          return {
            id: String(data.id),
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            image: data.image,
            accessToken: data.accessToken,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // On initial sign-in, persist the accessToken into the JWT
      if (user) {
        token.accessToken = (user as unknown as Record<string, unknown>).accessToken;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as Record<string, unknown>).accessToken = token.accessToken;
        (session.user as Record<string, unknown>).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60, // 1 hour, matching DummyJSON token expiry
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
