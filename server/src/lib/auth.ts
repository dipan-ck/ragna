import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";

export const auth = betterAuth({
    baseURL: env.BETTER_AUTH_URL,

    trustedOrigins: ["https://ragna.dipanck.com"],

    advanced: {
        crossSubDomainCookies: {
            enabled: true,
            domain: ".dipanck.com", // root domain with leading dot — NOT .ragna.dipanck.com
        },
        defaultCookieAttributes: {
            sameSite: "lax",
            secure: true,
            httpOnly: true,
        },
        cookies: {
            session_token: {
                attributes: {
                    sameSite: "lax",
                    secure: true,
                    domain: ".dipanck.com",
                    path: "/",
                },
            },
        },
    },

    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    emailAndPassword: {
        enabled: true,
    },

    socialProviders: {
        github: {
            clientId: env.GITHUB_CLIENT_ID as string,
            clientSecret: env.GITHUB_CLIENT_SECRET as string,
        },
        google: {
            clientId: env.GOOGLE_CLIENT_ID as string,
            clientSecret: env.GOOGLE_CLIENT_SECRET as string,
        },
    },
});
