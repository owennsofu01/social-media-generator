import React from "react";
import HeroSection from "./HeroSection";
import BenefitsSection from "./BenefitsSection";
import TestimonialsSection from "./TestimonialsSection";
import CTASection from "./CTASection";

const Home = () => (
  <div className="home-page">
    <HeroSection />
    <BenefitsSection />
    <TestimonialsSection />
    <CTASection />
  </div>
);

export default Home;
