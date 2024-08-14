import { ThemeProvider } from "@/components/theme-provider";
import LinkLockerLogo from "@/images/LinkLockerLogo.png";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "900", "800"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
  icons: [{ url: LinkLockerLogo.src }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          inter.className,
          "bg-stone-100/80 dark:bg-inherit overflow-hidden"
        )}
      >
        <NextTopLoader
          color="rgb(14 165 233)"
          showSpinner={false}
          height={3}
          speed={600}
          crawlSpeed={600}
        />
        <Toaster />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="mx-10 my-10 rounded-2xl bg-gradient-to-b from-stone-300/50 to-stone-300 dark:bg-gradient-to-b dark:from-stone-800/60 dark:to-stone-800 dark:text-white shadow-lg shadow-stone-400 dark:shadow-stone-700">
            {/* <TryPasteComponent>
              </TryPasteComponent> */}
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
