import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { useNavigate, useSearchParams } from "react-router-dom";

export function AuthForms() {
  const [searchParams] = useSearchParams();
  const inviteCode = searchParams.get('invite');
  const { signIn, user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled in the auth context
    }
  };

  return (
    <div>
      <Header user={user} signOut={signOut} />
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Welcome Back to Hustle Saturday</CardTitle>
            <CardDescription>
              Sign in to continue your journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
              <div className="text-center space-y-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => navigate(`/auth/signup${inviteCode ? `?invite=${inviteCode}` : ''}`)}
                >
                  Don't have an account? Sign Up
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}