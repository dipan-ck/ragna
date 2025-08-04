import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ReactQueryProvider from "@/lib/react-query-client";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // choose only weights you use
  variable: "--font-poppins", // optional for Tailwind integration
});

export const metadata: Metadata = {
  title: {
    default: "Ragna - Build AI Agents with Your Own Data",
    template: "%s | Ragna",
  },

  icons: {
    icon: [
      {
        url: "/logo.svg",
        sizes: "any",
      },
      {
        url: "/logo.svg",
        type: "image/svg",
        sizes: "32x32",
      },
    ],
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  description:
    "Create intelligent AI assistants powered by your documents. Upload PDFs, DOCX, CSV files, and raw text to build custom agents that understand your specific knowledge base. Zero hallucinations, lightning-fast responses.",
  keywords: [
    "AI agents",
    "knowledge base",
    "chatbot",
    "artificial intelligence",
    "document AI",
    "custom AI",
    "vector database",
    "RAG",
    "GPT-4",
    "Claude",
    "Gemini",
    "AI integration",
    "embeddable chat",
    "no-code AI",
  ],
  authors: [{ name: "dipan chakraborty" }],
  creator: "dipan chakraborty",
  publisher: "dipan chakraborty",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
  classification: "AI Platform",
  referrer: "origin-when-cross-origin",
  colorScheme: "dark",

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body className={`${poppins.className}`}>
        <Toaster
          toastOptions={{
            duration: 4000,
            position: 'top-center',
            style: {
              background: '#0a1526',
              color: '#2194FF',
              padding: '8px',
              fontSize: '14px',
              borderRadius: '10px',
              border: '1px solid #2194FF'
            },
            iconTheme: {
              primary: '#2194FF',
              secondary: '#0a1526'
            }
          }}
        />
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
        >
                 <ReactQueryProvider>{children}</ReactQueryProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
