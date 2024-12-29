import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { BottomCTA } from "@/components/landing/BottomCTA";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";

export default function Landing() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-[#F1F1F1] relative overflow-hidden">
      {/* Metro-inspired background grid */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(to right, #403E43 1px, transparent 1px),
              linear-gradient(to bottom, #403E43 1px, transparent 1px)
            `,
            backgroundSize: '4rem 4rem',
            opacity: 0.05
          }}
        />
      </div>

      {/* Decorative subway lines */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute h-1 bg-[#ea384c] transform rotate-45 -left-20 top-1/4 w-96 opacity-20" />
        <div className="absolute h-1 bg-[#0EA5E9] transform -rotate-45 -right-20 top-1/3 w-96 opacity-20" />
        <div className="absolute h-1 bg-[#22c55e] transform rotate-30 left-1/4 top-2/3 w-96 opacity-20" />
        <div className="absolute h-1 bg-[#F97316] transform -rotate-30 right-1/4 bottom-1/4 w-96 opacity-20" />
      </div>

      <div className="relative z-10">
        <Header user={user} signOut={signOut} />
        <main className="space-y-12 overflow-hidden">
          <HeroSection />
          <FeaturesSection />
          <HowItWorksSection />
          <AboutSection />
          <BottomCTA />
        </main>
      </div>
    </div>
  );
}