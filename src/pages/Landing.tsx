import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
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
      </main>
    </div>
  );
}