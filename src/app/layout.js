import "./globals.css";

export const metadata = {
  title: "The 4ther Hub | Empowering NGOs",
  description: "Find resources, tools, and knowledge to strengthen your NGO's capacity and impact.",
  icons: {
    icon: "/4ther-hub-site.png",
  },
  openGraph: {
    title: "The 4ther Hub",
    description: "Find resources, tools, and knowledge to strengthen your NGO's capacity and impact.",
    url: "https://hub.4ther.com",
    siteName: "The 4ther Hub",
    images: [
      {
        url: "/4ther-hub.png",
        width: 1200,
        height: 630,
        alt: "The 4ther Hub - Find resources, tools, and knowledge to strengthen your NGO's capacity and impact",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "4ther Hub",
    description: "Find resources, tools, and knowledge to strengthen your NGO's capacity and impact.",
    images: ["/4ther-hub.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}