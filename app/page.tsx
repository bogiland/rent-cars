import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyBookBar } from "@/components/layout/StickyBookBar";
import { Hero } from "@/components/sections/Hero";
import { CategoriesGrid } from "@/components/sections/CategoriesGrid";
import { RecommendedCars } from "@/components/sections/RecommendedCars";
import { FeaturedFleet } from "@/components/sections/FeaturedFleet";
import { PartnerLogos } from "@/components/sections/PartnerLogos";
import { CitiesGrid } from "@/components/sections/CitiesGrid";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { SeoIntro } from "@/components/sections/SeoIntro";
import { WhyUs } from "@/components/sections/WhyUs";

export default function HomePage() {
  return (
    <>
      <Header />

      <main id="main" tabIndex={-1}>
        <div id="hero">
          <Hero />
        </div>

        <CategoriesGrid />
        <SeoIntro />
        <WhyUs />
        <RecommendedCars />
        <FeaturedFleet />
        <Testimonials />
        <PartnerLogos />
        <CitiesGrid />

        <div id="faq">
          <FAQ />
        </div>
      </main>

      <Footer />
      <StickyBookBar heroId="hero" />
    </>
  );
}
