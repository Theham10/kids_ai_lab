import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KidGenius AI - 스텔라의 마법 연구소 🚀",
  description: "아이들의 상상을 디즈니 영화처럼 그려내는 세상에서 가장 똑똑한 AI 놀이터",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🚀</text></svg>" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
