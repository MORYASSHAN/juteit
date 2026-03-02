import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Heart, Leaf, Recycle } from "lucide-react";
import { motion } from "motion/react";
import { Suspense, useState } from "react";
import BannerCarousel from "../components/BannerCarousel";
import Footer from "../components/Footer";
import JuteScene3D from "../components/JuteScene3D";
import { Navbar } from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { MOCK_BANNERS, MOCK_PRODUCTS } from "../data/mockData";
import { api } from "../lib/api";

const CATEGORIES = [
  { name: "All", icon: "🏠", desc: "Everything we offer" },
  { name: "Bags", icon: "👜", desc: "Stylish & sustainable" },
  { name: "Home Decor", icon: "🏺", desc: "Natural elegance" },
  { name: "Stationery", icon: "📝", desc: "Eco-friendly notes" },
  { name: "Utility", icon: "🛠️", desc: "Practical solutions" },
];

const FEATURES = [
  { title: "Eco-Friendly", icon: Leaf, desc: "100% natural materials" },
  { title: "Recyclable", icon: Recycle, desc: "Good for the planet" },
  { title: "Handcrafted", icon: Heart, desc: "Made with local love" },
];

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const { data: products = MOCK_PRODUCTS, isLoading: productsLoading } = useQuery<any[]>({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        const res = await api.get('/products');
        return res.length > 0 ? res : MOCK_PRODUCTS;
      } catch {
        return MOCK_PRODUCTS;
      }
    },
  });

  const { data: banners = MOCK_BANNERS, isLoading: bannersLoading } = useQuery<any[]>({
    queryKey: ["banners"],
    queryFn: async () => {
      try {
        const res = await api.get('/banners');
        return res.length > 0 ? res : MOCK_BANNERS;
      } catch {
        return MOCK_BANNERS;
      }
    },
  });

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const allCategories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-stone-100 via-amber-50 to-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-0">
            <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[500px]">
              {/* Text */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="py-8 lg:py-12"
              >
                <Badge className="mb-4 bg-jute-olive/20 text-jute-olive border-jute-olive/30 font-ui">
                  🌿 Eco-Friendly Living
                </Badge>
                <h1 className="font-display text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4">
                  Natural Jute
                  <span className="block text-jute-brown">Crafted with</span>
                  <span className="block italic text-jute-olive">Love</span>
                </h1>
                <p className="text-muted-foreground text-lg mb-8 max-w-md leading-relaxed">
                  Discover handcrafted jute products that bring warmth and
                  sustainability to every corner of your life.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 font-ui"
                    asChild
                  >
                    <a href="#products">
                      Shop Now
                      <ArrowRight className="h-5 w-5" />
                    </a>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/10 font-ui"
                    asChild
                  >
                    <a href="#categories">Browse Categories</a>
                  </Button>
                </div>

                {/* Stats */}
                <div className="flex gap-6 mt-10">
                  {[
                    { num: "500+", label: "Products" },
                    { num: "10k+", label: "Happy Buyers" },
                    { num: "100%", label: "Natural" },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="font-display text-2xl font-bold text-jute-brown">
                        {s.num}
                      </div>
                      <div className="text-xs text-muted-foreground font-ui">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* 3D Scene */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative"
              >
                <Suspense
                  fallback={
                    <Skeleton className="w-full h-[320px] md:h-[420px] rounded-2xl" />
                  }
                >
                  <JuteScene3D />
                </Suspense>
              </motion.div>
            </div>
          </div>

          {/* Decorative element */}
          <div
            className="absolute -bottom-8 left-0 right-0 h-16 bg-background"
            style={{ clipPath: "ellipse(55% 100% at 50% 100%)" }}
          />
        </section>

        {/* Offer Banners */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BannerCarousel banners={banners} />
        </section>

        {/* Categories */}
        <section
          id="categories"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Browse Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CATEGORIES.map((cat, i) => (
                <motion.button
                  key={cat.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${activeCategory === cat.name
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/50"
                    }`}
                >
                  <div className="text-3xl mb-2">{cat.icon}</div>
                  <div className="font-display font-semibold text-foreground">
                    {cat.name}
                  </div>
                  <div className="text-xs text-muted-foreground font-ui mt-0.5">
                    {cat.desc}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Products Grid */}
        <section
          id="products"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
          <div className="flex items-center justify-between mb-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl font-bold text-foreground"
            >
              {activeCategory === "All" ? "All Products" : activeCategory}
            </motion.h2>

            {/* Category Filter Tabs */}
            <div className="hidden md:flex gap-2 flex-wrap">
              {allCategories.map((cat: any) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-ui rounded-full transition-all ${activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product: any, i: number) => (
              <ProductCard
                key={product._id || product.id || i}
                product={product}
                index={i}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🧺</div>
              <p className="font-display text-xl text-muted-foreground">
                No products in this category yet
              </p>
            </div>
          )}
        </section>

        {/* Features */}
        <section className="bg-muted/50 py-12 mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {FEATURES.map((feat, i) => (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="h-12 w-12 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                    <feat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground mb-1">
                      {feat.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">{feat.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Hero Image Band */}
        <section id="about" className="relative h-64 overflow-hidden mt-12">
          <img
            src="/assets/generated/hero-banner.dim_1200x500.jpg"
            alt="JuteIt Collection"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center text-white px-4"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
                Crafted with Purpose
              </h2>
              <p className="text-white/80 text-lg">
                Every product tells a story of sustainability and tradition
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
