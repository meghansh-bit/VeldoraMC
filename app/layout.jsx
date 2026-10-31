import "../src/index.css";

export const metadata = {
  metadataBase: new URL("https://veldoramc.vercel.app"),
  title: {
    default: "VeldoraMC — Your Next Adventure Starts Here",
    template: "%s | VeldoraMC",
  },
  description: "Discover VeldoraMC Minecraft experiences, meet the community, and find your next adventure.",
  openGraph: {
    title: "VeldoraMC — Your Next Adventure Starts Here",
    description: "Discover VeldoraMC Minecraft experiences and join the community.",
    url: "https://veldoramc.vercel.app",
    siteName: "VeldoraMC",
    type: "website",
    images: ["/og-image.svg"],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport = {
  themeColor: "#0D0E12",
  colorScheme: "dark",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
