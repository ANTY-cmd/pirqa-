
import NavigationBar from "./NavigationBar";
import { Toaster } from "@/components/ui/toaster";

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
      <footer className="bg-muted py-6">
        <div className="container mx-auto px-4">
          <div className="andean-pattern-divider mb-4"></div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} La Pirqa - Control Electoral
            </div>
            <div className="text-sm text-muted-foreground">
              Desarrollado para Bolivia
            </div>
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}
