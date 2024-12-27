import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AuthForms } from "@/components/AuthForms";
import { Shield, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const GroupLanding = () => {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [groupName, setGroupName] = useState("Loading...");
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get('id');

  useEffect(() => {
    const fetchGroupDetails = async () => {
      if (!groupId) {
        toast({
          title: "Error",
          description: "No group ID provided",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      const { data: group, error } = await supabase
        .from('groups')
        .select('name')
        .eq('id', groupId)
        .single();

      if (error) {
        console.error('Error fetching group:', error);
        toast({
          title: "Error",
          description: "Unable to load group details",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      if (group) {
        setGroupName(group.name);
      }
    };

    fetchGroupDetails();
  }, [groupId, navigate, toast]);

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
            group_id: groupId,
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
            <CardTitle>Join {groupName}</CardTitle>
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