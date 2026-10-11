import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { versionedImagePath } from "@/lib/image-url";

export const metadata = {
  metadataBase: new URL("https://finocast.com"),
  title: { default: "Finocast | Precision Investment Casting", template: "%s | Finocast" },
  description: "Fino Cast Private Limited manufactures precision investment castings in Miraj, Maharashtra, with selected machining supported through manufacturing collaborations.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  openGraph: { type: "website", siteName: "Finocast", title: "Finocast | Precision Investment Casting", description: "Investment castings and machining for industrial applications.", images: [versionedImagePath("/images/01_hero/hero_foundry_pouring.jpg")] },
  robots: { index: true, follow: true },
  other: { "theme-color": "#f2f1ed" },
};

export default function RootLayout({ children }) {
  return <html lang="en"><body><a className="skip-link" href="#main-content">Skip to content</a><Header/><main id="main-content">{children}</main><Footer/></body></html>;
}
