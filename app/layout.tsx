import type { Metadata } from "next";
import { Alexandria, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

const alexandria = Alexandria({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-sans',
});


export const metadata: Metadata = {
  title: "Wikibinge",
  description: "Wikipedia but it's an algorithim",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${alexandria.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background">
        <AuthProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </AuthProvider>
        <Toaster/>
      </body>
    </html>
  );
}
