import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle } from "lucide-react";

// A single-field email form doesn't need react-hook-form + zod (~30KB of JS
// that would otherwise load on every page via the footer).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterBar() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const subscribeMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to subscribe");
      return result;
    },
    onSuccess: (data) => {
      setIsSubscribed(true);
      setEmail("");
      toast({ title: "Subscribed!", description: data.message });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to subscribe",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email",
        variant: "destructive",
      });
      return;
    }
    subscribeMutation.mutate(email);
  };

  if (isSubscribed) {
    return (
      <div className="flex items-center gap-2 text-primary-foreground">
        <CheckCircle className="h-4 w-4 text-green-400" />
        <span className="text-sm">Subscribed!</span>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <Input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-9 w-48 bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/60 text-sm"
        disabled={subscribeMutation.isPending}
      />
      <Button
        type="submit"
        size="sm"
        className="h-9 px-4 bg-accent hover:bg-accent/90 text-accent-foreground text-sm"
        disabled={subscribeMutation.isPending}
      >
        {subscribeMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Subscribe"
        )}
      </Button>
    </form>
  );
}
