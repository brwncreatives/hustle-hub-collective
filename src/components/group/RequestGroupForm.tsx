import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const RequestGroupForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    groupName: "",
    managerFullName: "",
    managerEmail: "",
    friendEmails: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRequest = async () => {
    if (!formData.groupName.trim() || !formData.managerFullName.trim() || !formData.managerEmail.trim()) {
      toast({
        variant: "destructive",
        title: "Required Fields",
        description: "Please fill in the group name, your full name, and email.",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/request-group`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
          },
          body: JSON.stringify({
            groupName: formData.groupName,
            managerFullName: formData.managerFullName,
            managerEmail: formData.managerEmail,
            friendEmails: formData.friendEmails.split(',').map(email => email.trim()).filter(email => email),
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit request");
      }

      toast({
        title: "Request Submitted",
        description: "We've received your request to create a group. We'll be in touch soon!",
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit request",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Request to Create a Group</CardTitle>
          <CardDescription>
            Join our waitlist to create your own accountability group. Our team will review your request 
            and get back to you via email with next steps.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="managerFullName">Your Full Name *</Label>
              <Input
                id="managerFullName"
                name="managerFullName"
                placeholder="Enter your full name"
                value={formData.managerFullName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="managerEmail">Your Email *</Label>
              <Input
                id="managerEmail"
                name="managerEmail"
                type="email"
                placeholder="Enter your email address"
                value={formData.managerEmail}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="groupName">Group Name *</Label>
              <Input
                id="groupName"
                name="groupName"
                placeholder="Enter your proposed group name"
                value={formData.groupName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="friendEmails">Friend Emails (Optional)</Label>
              <Input
                id="friendEmails"
                name="friendEmails"
                placeholder="Enter email addresses, separated by commas"
                value={formData.friendEmails}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
            <p className="font-medium">What happens next?</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Our team will review your request</li>
              <li>We'll reach out via email with additional information</li>
              <li>You'll receive guidance on setting up and managing your group</li>
            </ul>
          </div>

          <Button 
            onClick={handleRequest} 
            className="w-full"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Request to Create a Group"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};