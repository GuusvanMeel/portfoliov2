import type { Metadata } from "next";
import "./globals.css";
import { siteName, siteUrl } from "@/config/site";
import { messages } from "@/content/en";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/features/theme/ThemeProvider";
import { defaultTheme, isThemeName, themeCookie } from "@/features/theme/themeNames";
import { readPreference } from "@/lib/preferenceCookie";

const site = messages.site;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: site.title,
    template: site.titleTemplate,
  },

  description: site.description,

  creator: site.author,
  authors: [{ name: site.author }],

  keywords: [...site.keywords],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: site.openGraph.title,
    description: site.openGraph.description,
    url: "/",
    siteName,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/profilepic.jpg",
        width: 1200,
        height: 630,
        alt: site.openGraph.imageAlt,
      },
    ],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The server renders the chosen theme, so the first render matches what the visitor sees.
  const savedTheme = (await cookies()).get(themeCookie)?.value;
  const initialTheme = readPreference(savedTheme, isThemeName, defaultTheme);

  return (
    <html lang="en" suppressHydrationWarning className={` h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ThemeProvider initialTheme={initialTheme} hasThemeCookie={isThemeName(savedTheme)}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
