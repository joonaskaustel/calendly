import { SupabaseAdapter } from "@auth/supabase-adapter";
import type { DefaultSession, NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import { env } from "~/env";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string;
			// ...other properties
			// role: UserRole;
		} & DefaultSession["user"];
	}

	// interface User {
	//   // ...other properties
	//   // role: UserRole;
	// }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
	providers: [
		DiscordProvider,
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
		Credentials({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			authorize: async (credentials) => {
				if (!credentials?.email && !credentials?.password) {
					return null;
				}

				try {
					// Import supabase in the authorize function to avoid
					// importing it in the server component
					const { createClient } = await import('@supabase/supabase-js');
					
					const supabase = createClient(
						env.NEXT_PUBLIC_SUPABASE_URL,
						env.NEXT_PUBLIC_SUPABASE_ANON_KEY
					);
					
					const { data, error } = await supabase.auth.signInWithPassword({
						email: credentials.email,
						password: credentials.password,
					});
					
					if (error || !data.user) {
						return null;
					}
					
					return {
						id: data.user.id,
						email: data.user.email,
						name: data.user.email?.split('@')[0] || null,
					};
				} catch (error) {
					console.error('Error during Supabase authentication:', error);
					return null;
				}
			},
		}),
		/**
		 * ...add more providers here.
		 *
		 * Most other providers require a bit more work than the Discord provider. For example, the
		 * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
		 * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
		 *
		 * @see https://next-auth.js.org/providers/github
		 */
	],
	adapter: SupabaseAdapter({
		url: env.NEXT_PUBLIC_SUPABASE_URL,
		secret: env.SUPABASE_SERVICE_ROLE_KEY,
	}),
	session: {
		strategy: "jwt",
	},
	pages: {
		signIn: "/api/auth/signin",
		signOut: "/api/auth/signout",
		error: "/api/auth/error",
		newUser: "/register", // Redirect to our custom registration page for new users
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id as string;
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user.id = token.id as string;
			}
			return session;
		},
	},
} satisfies NextAuthConfig;
