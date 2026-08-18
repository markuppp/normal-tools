import type { Metadata, Viewport } from "next";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Normal Tools — Useful online tools, no nonsense",
    template: "%s — Normal Tools",
  },
  description:
    "Small, useful online tools that mostly work directly in your browser. No accounts, downloads, or unnecessary steps.",
  applicationName: "Normal Tools",
  authors: [{ name: "Normal Tools" }],
  category: "technology",
  keywords: [
    "online tools",
    "free tools",
    "browser tools",
    "gamepad tester",
    "touchscreen tester",
    "shutter count checker",
    "online converters",
    "free calculators",
    "developer tools",
  ],
  openGraph: {
    type: "website",
    siteName: "Normal Tools",
    title: "Normal Tools — Useful online tools, no nonsense",
    description:
      "Small, useful online tools that work directly in your browser.",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "Normal Tools",
    description: "Useful online tools, no nonsense.",
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4f1e8",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
