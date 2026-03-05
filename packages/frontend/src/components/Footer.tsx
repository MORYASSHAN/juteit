import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Leaf, Youtube } from "lucide-react";
import { api } from "../lib/api";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  const { data: settings } = useQuery({
    queryKey: ["owner-settings"],
    queryFn: async () => {
      return await api.get('/settings');
    },
  });

  return (
    <footer className="bg-foreground text-background mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Leaf className="h-6 w-6 text-jute-olive" />
              <span className="font-display text-xl font-bold text-background">
                JuteIt
              </span>
            </div>
            <p className="text-background/70 text-sm leading-relaxed max-w-xs">
              Handcrafted jute products made with love. We bring sustainable,
              eco-friendly products to your everyday life while supporting local
              artisans.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="https://www.instagram.com/juteit_222?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-background/50 hover:text-background transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-background/50 hover:text-background transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com/@jyotis_222?si=GnnmL4h8ykRQKzO5"
                target="_blank"
                rel="noopener noreferrer"
                className="text-background/50 hover:text-background transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-ui font-semibold text-background mb-3 text-sm uppercase tracking-wider">
              Shop
            </h3>
            <ul className="space-y-2">
              {["Bags", "Home Decor", "Storage", "Accessories"].map((cat) => (
                <li key={cat}>
                  <Link
                    to="/"
                    className="text-background/60 hover:text-background text-sm transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="font-ui font-semibold text-background mb-3 text-sm uppercase tracking-wider">
              Help
            </h3>
            <ul className="space-y-2">
              {["Track Order", "Returns", "Contact Us", "FAQ"].map((link) => (
                <li key={link}>
                  <a
                    href="/orders"
                    className="text-background/60 hover:text-background text-sm transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-background/50 text-xs">
            © {year} JuteIt. All rights reserved.
          </p>
          <p className="text-background/40 text-xs">
            Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-background/70 underline transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
