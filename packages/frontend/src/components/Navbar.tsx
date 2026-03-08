import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Menu, Moon, Package, Search, ShoppingCart, Sun, User, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "./ThemeProvider";

export function Navbar() {
  const { totalCount } = useCart();
  const { user, isOwner, isLoggedIn, logout, role } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  const navLinks = [
    { label: "Shop", href: "/" as const },
    { label: "My Orders", href: "/orders" as const },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/logo.png"
              alt="JuteIt"
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-ui font-medium text-foreground/70 hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {isOwner && (
              <Link
                to="/owner"
                className="text-sm font-ui font-medium text-jute-olive hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-sm mx-8 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-9 h-9 font-ui text-sm bg-muted/50 border-none focus-visible:ring-primary/20 transition-all font-medium"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const val = (e.target as HTMLInputElement).value;
                  navigate({ to: "/", search: { search: val } as any });
                }
              }}
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 px-0"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground rounded-full">
                    {totalCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Auth */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline text-xs capitalize">
                      {user?.name || role}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isOwner ? (
                    <>
                      <DropdownMenuItem
                        onClick={() => navigate({ to: "/owner" })}
                        className="cursor-pointer"
                      >
                        <Package className="h-4 w-4 mr-2" />
                        Dashboard
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem
                        onClick={() => navigate({ to: "/profile" })}
                        className="cursor-pointer"
                      >
                        <User className="h-4 w-4 mr-2" />
                        My Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate({ to: "/orders" })}
                        className="cursor-pointer"
                      >
                        <Package className="h-4 w-4 mr-2" />
                        My Orders
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => navigate({ to: "/login" })}
              >
                Login
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-card"
          >
            <div className="px-4 py-3 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="py-2 text-sm font-ui font-medium text-foreground/70 hover:text-foreground transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {isOwner && (
                <Link
                  to="/owner"
                  className="py-2 text-sm font-ui font-medium text-jute-olive"
                  onClick={() => setMobileOpen(false)}
                >
                  Owner Dashboard
                </Link>
              )}
              {!isLoggedIn && (
                <Button
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => {
                    navigate({ to: "/login" });
                    setMobileOpen(false);
                  }}
                >
                  Login / Sign Up
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
