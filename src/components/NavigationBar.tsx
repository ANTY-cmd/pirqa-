
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavItem {
  title: string;
  href: string;
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/" },
  { title: "Recintos", href: "/recintos" },
  { title: "Candidatos", href: "/candidatos" },
  { title: "Mesas", href: "/mesas" },
  { title: "Votos", href: "/votos" },
  { title: "Resultados", href: "/resultados" },
];

export default function NavigationBar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="andean-pattern-divider"></div>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-2xl font-bold text-andes-terra"
          >
            <div className="h-8 w-8 rounded bg-andes-terra flex items-center justify-center text-white">
              P
            </div>
            <span>La Pirqa</span>
          </Link>
        </div>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`text-sm font-medium transition-colors hover:text-andes-terra ${
                location.pathname === item.href
                  ? "text-andes-terra underline decoration-2 underline-offset-8"
                  : "text-foreground"
              }`}
            >
              {item.title}
            </Link>
          ))}
        </nav>
        
        {/* Mobile navigation */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <div className="flex flex-col gap-4 mt-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className={`px-2 py-1 text-sm font-medium transition-colors hover:text-andes-terra ${
                    location.pathname === item.href
                      ? "text-andes-terra font-bold"
                      : "text-foreground"
                  }`}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
