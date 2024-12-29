import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function SignUpForm() {
  const [loading, setLoading] = useState(false);
  const { signUp, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteCode = searchParams.get('invite');
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;

    try {
      if (inviteCode) {
        // Verify invite code before signup
        const { data: inviteData, error: inviteError } = await supabase
          .from('group_invites')
          .select('group_id, status, expires_at, email')
          .eq('id', inviteCode)
          .single();

        if (inviteError || !inviteData) {
          throw new Error('Invalid invite code');
        }

        if (inviteData.status !== 'pending') {
          throw new Error('This invite has already been used');
        }

        if (new Date(inviteData.expires_at) < new Date()) {
          throw new Error('This invite has expired');
        }

        if (inviteData.email && inviteData.email !== email) {
          throw new Error('This invite was sent to a different email address');
        }
      }

      await signUp(email, password, firstName, lastName);
      
      if (inviteCode) {
        // After successful signup, join the group
        const { data: inviteData } = await supabase
          .from('group_invites')
          .select('group_id')
          .eq('id', inviteCode)
          .single();

        if (inviteData) {
          await supabase
            .from('group_members')
            .insert({
              group_id: inviteData.group_id,
              user_id: user?.id,
              role: 'member'
            });

          await supabase
            .from('group_invites')
            .update({ status: 'accepted' })
            .eq('id', inviteCode);
        }
      }

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to sign up",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header user={user} signOut={signOut} />
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Create Your Account</CardTitle>
            <CardDescription>
              {inviteCode 
                ? "Sign up to join your accountability group"
                : "Sign up to start tracking your goals"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  required
                />
              </div>
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
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating Account..." : "Sign Up"}
              </Button>
              <div className="text-center space-y-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => navigate('/auth/login')}
                >
                  Already have an account? Sign In
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}