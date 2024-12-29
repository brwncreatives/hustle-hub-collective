import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";

export default function Landing() {
  const { user, signOut } = useAuth();

  return (
    <div className="bg-background">
      <Header user={user} signOut={signOut} />
      <main>
        <HeroSection />
        <FeaturesSection />
        <AboutSection />
        <HowItWorksSection />
      </main>
    </div>
  );
}