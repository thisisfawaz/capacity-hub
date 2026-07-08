import "./globals.css";

export const metadata = {
  title: "4ther Hub | Empowering NGOs",
  description: "Empowering NGOs with the tools, knowledge and resources to build stronger, more sustainable organisations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
