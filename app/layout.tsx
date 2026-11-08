import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE } from "@/lib/content";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/sections";
import { BrandSprite } from "@/components/brand-sprite";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: `${SITE.name} — Software Engineer (Backend, Distributed Systems & GenAI)`,
  description: SITE.description,
  applicationName: SITE.name,
  creator: SITE.name,
  category: "technology",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  authors: [{ name: SITE.name, url: SITE.url }],
  keywords: [
    "Saurav Sharma",
    "Software Engineer",
    "SDE",
    "Backend",
    "Full Stack",
    "GenAI",
    "Python",
    "Go",
    "Node.js",
    "Kafka",
    "LangGraph",
    "RAG",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: SITE.url,
    title: `${SITE.name} — ${SITE.role}`,
    description: SITE.description,
    siteName: SITE.name,
  },
  twitter: { card: "summary_large_image", title: `${SITE.name} — ${SITE.role}`, description: SITE.description },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#ffffff", colorScheme: "light" };

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.name,
  jobTitle: SITE.role,
  url: SITE.url,
  email: `mailto:${SITE.email}`,
  sameAs: [SITE.github, SITE.linkedin],
  address: { "@type": "PostalAddress", addressRegion: "Delhi", addressCountry: "IN" },
  image: `${SITE.url}/opengraph-image`,
  knowsAbout: [
    "Python", "FastAPI", "Django", "Go", "Node.js", "NestJS", "TypeScript", "React", "Next.js",
    "PostgreSQL", "Redis", "Apache Kafka", "Kubernetes", "Docker", "AWS", "Distributed systems",
    "Microservices", "LangChain", "LangGraph", "Model Context Protocol", "Retrieval-augmented generation",
  ],
  alumniOf: { "@type": "CollegeOrUniversity", name: "Netaji Subhas University of Technology" },
  worksFor: { "@type": "Organization", name: "Devkraft" },
};

// Apply a saved "pause animations" choice before first paint.
const motionBootstrap = `try{if(localStorage.getItem('ss:motion')==='paused')document.documentElement.dataset.motion='paused'}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootstrap }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-dvh">
        <BrandSprite />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
