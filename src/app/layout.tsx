import type { Metadata } from "next";
import AmplifyConfig from "./AmplifyConfig";
import "./globals.css";

export const metadata: Metadata = {
  title: "Your App Title",
  description: "Your app description",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Ensure Amplify is configured before other components */}
        <AmplifyConfig />
        {children}
      </body>
    </html>
  );
}
