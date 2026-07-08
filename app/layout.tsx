import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./Features/Theme/ThemeProvider";





export const metadata: Metadata = {
  metadataBase: new URL("https://portfoliov2-brown-theta.vercel.app/"),

  title: {
    default: "Guus van Meel | Software Developer Portfolio",
    template: "%s | Guus van Meel",
  },

  description:
    "Portfolio van Guus van Meel, software developer gespecialiseerd in webdevelopment, C#, JavaScript, Next.js en backend development.",

  creator: "Guus van Meel",
  authors: [{ name: "Guus van Meel" }],

  keywords: [
    "Guus van Meel",
    "Portfolio",
    "Software developer",
    "Webdevelopment",
    "Next.js",
    "React",
    "TypeScript",
    "JavaScript",
    "C#",
    "Nederland",
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Guus van Meel | Portfolio",
    description: "Bekijk mijn projecten, ervaring en contactinformatie.",
    url: "/",
    siteName: "GuusOS Portfolio",
    type: "website",
    locale: "nl_NL",
    images: [
      {
        url: "/profilepic.jpg",
        width: 1200,
        height: 630,
        alt: "Guus van Meel Portfolio",
      },
    ],
  },


  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={` h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><ThemeProvider>{children}</ThemeProvider></body>
    </html>
  );
}
