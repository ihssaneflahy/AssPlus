import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

const API_URL = process.env.API_URL ?? 'http://localhost:3001';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        login: { label: 'Login', type: 'text' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const { data } = await axios.post(`${API_URL}/api/v1/auth/login`, {
            login: credentials?.login,
            password: credentials?.password,
          });
          if (data.accessToken) {
            return { id: data.user?.id, name: data.user?.nomComplet, email: data.user?.email, accessToken: data.accessToken, refreshToken: data.refreshToken, role: data.user?.role, agenceId: data.user?.agenceId };
          }
          return null;
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
        token.role = (user as any).role;
        token.agenceId = (user as any).agenceId;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      (session.user as any).role = token.role;
      (session.user as any).agenceId = token.agenceId;
      return session;
    },
  },
  pages: { signIn: '/login' },
  session: { strategy: 'jwt' },
};
