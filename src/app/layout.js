import { Inter } from "next/font/google";
import "./globals.css";
import clsx from 'clsx'
import FireFliesBackground from "@/components/FireFliesBackground";
import AudioPlayer from '@/components/AudioPlayer';
import WelcomeBubble from '@/components/WelcomeBubble';

const inter = Inter({
   subsets: ["latin"],
   variable: "--font-inter",
});

export const metadata = {
  title: "Manuel's Realm",
  description: "Everything about my professional progress",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={clsx(inter.variable, "bg-background text-foreground font-inter")}>
         {children}
         <FireFliesBackground />
         <AudioPlayer />
         <WelcomeBubble />  
      </body>
    </html>
  );
}