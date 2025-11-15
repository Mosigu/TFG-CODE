import type { Metadata } from "next";

import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";

export const metadata: Metadata = {
  title: "Project Management App",
  description: "Web app for project management of projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Theme
          accentColor="iris"
          radius="medium"
          grayColor="slate"
          appearance="light"
        >
          {children}
        </Theme>
      </body>
    </html>
  );
}
