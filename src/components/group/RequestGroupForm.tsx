import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const RequestGroupForm = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRequest = async () => {
    setLoading(true);
    try {
      // Here we'll call the edge function to send the email
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/request-group`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit request");
      }

      toast({
        title: "Request Submitted",
        description: "We've received your request to create a group. We'll be in touch soon!",
      });
      
      navigate("/dashboard");
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
            Join our waitlist to create your own accountability group. We'll review your request and get back to you soon.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleRequest} 
            className="w-full"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Join Waitlist"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};