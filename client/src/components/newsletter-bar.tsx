import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle } from "lucide-react";

const subscribeSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type SubscribeFormData = z.infer<typeof subscribeSchema>;

export default function NewsletterBar() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const form = useForm<SubscribeFormData>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: { email: "" },
  });

  const subscribeMutation = useMutation({
    mutationFn: async (data: SubscribeFormData) => {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to subscribe");
      return result;
    },
    onSuccess: (data) => {
      setIsSubscribed(true);
      form.reset();
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

  const onSubmit = (data: SubscribeFormData) => {
    subscribeMutation.mutate(data);
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
      <Input
        type="email"
        placeholder="Your email"
        {...form.register("email")}
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
