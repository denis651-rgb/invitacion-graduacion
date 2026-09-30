import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "¡Me gradué! - Jose Ronaldo Ortiz",
  description:
    "Te invito a celebrar mi graduación como Licenciado en Administración de Empresas.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000")
  ),
  openGraph: {
    title: "¡Me gradué! - Jose Ronaldo Ortiz",
    description:
      "Te invito a celebrar mi graduación como Licenciado en Administración de Empresas.",
    images: [
      {
        url: "/graduado.jpg",
        width: 800,
        height: 1000,
        alt: "Jose Ronaldo Ortiz Garnica - Graduación",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "¡Me gradué! - Jose Ronaldo Ortiz",
    description:
      "Te invito a celebrar mi graduación como Licenciado en Administración de Empresas.",
    images: ["/graduado.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth antialiased">
      <head>
        {/* OpenGraph & WhatsApp Sharing Meta Tags */}
        <meta property="og:title" content="¡Me gradué! - Jose Ronaldo Ortiz" />
        <meta
          property="og:description"
          content="Te invito a celebrar mi graduación como Licenciado en Administración de Empresas."
        />
        <meta property="og:image" content="/graduado.jpg" />
        <meta property="og:type" content="website" />

        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Montserrat:wght@300;400;600&display=swap"
          rel="stylesheet"
        />

        {/* Canvas Confetti Library via CDN */}
        <script
          src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.4/dist/confetti.browser.min.js"
          async
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#022327] text-teal-50 selection:bg-teal-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
