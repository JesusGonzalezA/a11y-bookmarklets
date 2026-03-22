import { Outlet } from "react-router";
import { Header } from "@/app/layout/Header";
import { Footer } from "@/app/layout/Footer";
import { Separator } from "@/shared/ui/separator";

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md"
      >
        Skip to main content
      </a>

      <Header />

      <main id="main-content" className="flex-1">
        <Outlet />
      </main>

      <Separator />
      <Footer />
    </div>
  );
}
