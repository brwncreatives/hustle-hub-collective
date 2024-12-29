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
      {/* Metro-inspired flowing background */}
      <div className="absolute inset-0 z-0">
        {/* Curved metro lines */}
        <div 
          className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2 opacity-[0.03]"
          style={{
            background: `
              radial-gradient(circle at 50% 50%, transparent 20%, #403E43 20.5%, transparent 21%),
              radial-gradient(circle at 0% 50%, transparent 30%, #403E43 30.5%, transparent 31%),
              radial-gradient(circle at 100% 50%, transparent 40%, #403E43 40.5%, transparent 41%)
            `,
            backgroundSize: '60px 60px',
            transform: 'rotate(-15deg)',
          }}
        />
      </div>

      {/* Decorative subway lines with curves */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <svg className="absolute w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M -10,20 Q 30,40 70,20 T 110,40" fill="none" stroke="#ea384c" strokeWidth="0.5" />
          <path d="M -10,40 Q 40,60 80,40 T 110,60" fill="none" stroke="#0EA5E9" strokeWidth="0.5" />
          <path d="M -10,60 Q 50,80 90,60 T 110,80" fill="none" stroke="#22c55e" strokeWidth="0.5" />
          <path d="M -10,80 Q 60,100 100,80 T 110,100" fill="none" stroke="#F97316" strokeWidth="0.5" />
        </svg>
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