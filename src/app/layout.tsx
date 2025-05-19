import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { SidebarProvider } from "@/context/SidebarContext";

export const metadata = {
  title: "Sangbong's Portfolio",
  description: "Welcome to Sangbong's portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <SidebarProvider>
          <Header/>
          <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 h-full flex flex-col">
              {children}
            </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
