import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { Showcase } from "@/components/sections/Showcase";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/layout/Header";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Features />
      <Showcase />
      <Footer />
    </main>
  );
}
