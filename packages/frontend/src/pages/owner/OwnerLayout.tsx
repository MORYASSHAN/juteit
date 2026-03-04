import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  ArrowLeft,
  ClipboardList,
  LayoutDashboard,
  Leaf,
  Megaphone,
  Package,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  {
    href: "/owner" as const,
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  { href: "/owner/products" as const, label: "Products", icon: Package },
  { href: "/owner/banners" as const, label: "Banners", icon: Megaphone },
  { href: "/owner/orders" as const, label: "Orders", icon: ClipboardList },
  { href: "/owner/settings" as const, label: "Settings", icon: Settings },
];

interface OwnerLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

export default function OwnerLayout({
  children,
  title,
  description,
}: OwnerLayoutProps) {
  const routerState = useRouterState();
  const navigate = useNavigate();
  const { isOwner, isLoggedIn } = useAuth();
  const pathname = routerState.location.pathname;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate({ to: "/login" });
    } else if (!isOwner) {
      navigate({ to: "/" });
    }
  }, [isLoggedIn, isOwner, navigate]);

  if (!isLoggedIn || !isOwner) return null;

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Top Bar */}
      <header className="bg-card border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-ui">Store</span>
          </Link>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-jute-olive" />
            <span className="font-display font-bold text-foreground">
              JuteIt
            </span>
            <span className="text-muted-foreground font-ui text-sm">
              Owner Panel
            </span>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-52 shrink-0 hidden md:flex flex-col bg-card border-r border-border py-4">
          <nav className="flex flex-col gap-1 px-3">
            {NAV_ITEMS.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-ui font-medium transition-all",
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 flex">
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-ui transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Main */}
        <main className="flex-1 p-5 pb-20 md:pb-5 overflow-auto">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <h1 className="font-display text-2xl font-bold text-foreground">
                {title}
              </h1>
              {description && (
                <p className="text-muted-foreground font-ui text-sm mt-1">
                  {description}
                </p>
              )}
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
