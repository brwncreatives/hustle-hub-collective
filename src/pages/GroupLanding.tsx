import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AuthForms } from "@/components/AuthForms";
import { Shield, Users } from "lucide-react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://zpbqzuazbmgyifhwphga.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwYnF6dWF6Ym1neWlmaHdwaGdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQxMjI0MTgsImV4cCI6MjA0OTY5ODQxOH0.HVvzkkFpq4m_AecBfYHyyVYHoZgJRIi8uxMxvBOBLmA'
);

const GroupLanding = () => {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // TODO: Replace with actual group title from your data
  const groupTitle = "Study Group"; // This should be fetched from your database

  const handleJoinRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to request joining this group",
        variant: "destructive",
      });
      return;
    }

    if (!email || !firstName || !lastName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('group_join_requests')
        .insert([
          {
            user_id: user.id,
            group_id: '1', // This should be dynamic based on the actual group
            message,
            email,
            first_name: firstName,
            last_name: lastName,
            status: 'pending'
          }
        ]);

      if (error) {
        console.error('Error submitting join request:', error);
        toast({
          title: "Error",
          description: "Unable to submit join request. Please try again later.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Your request to join has been submitted. The group admin will review it shortly.",
      });
      setMessage("");
      setEmail("");
      setFirstName("");
      setLastName("");
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            <CardTitle>Join {groupTitle}</CardTitle>
          </div>
          <CardDescription>
            Submit a request to join this group. The group admin will review your request.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="h-5 w-5" />
                <p>Please sign in to request joining this group</p>
              </div>
              <AuthForms />
            </div>
          ) : (
            <form onSubmit={handleJoinRequest} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message to Group Admin
                </label>
                <Textarea
                  id="message"
                  placeholder="Briefly explain why you'd like to join this group..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <Button type="submit" className="w-full">
                Submit Join Request
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupLanding;