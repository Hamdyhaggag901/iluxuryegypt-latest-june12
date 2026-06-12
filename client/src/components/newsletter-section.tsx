import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, Loader2, CheckCircle } from "lucide-react";

const subscribeSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type SubscribeFormData = z.infer<typeof subscribeSchema>;

export default function NewsletterSection() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const form = useForm<SubscribeFormData>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: {
      email: "",
    },
  });

  const subscribeMutation = useMutation({
    mutationFn: async (data: SubscribeFormData) => {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to subscribe");
      }

      return result;
    },
    onSuccess: (data) => {
      setIsSubscribed(true);
      form.reset();
      toast({
        title: "Subscribed!",
        description: data.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SubscribeFormData) => {
    subscribeMutation.mutate(data);
  };

  return (
    <section className="py-20 bg-primary relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90"></div>
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-6">
          <Mail className="h-12 w-12 mx-auto text-accent" />
        </div>

        <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-4">
          Stay Inspired
        </h2>

        <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
          Subscribe to receive exclusive offers, travel inspiration, and insider tips
          for your next Egyptian adventure.
        </p>

        {isSubscribed ? (
          <div className="flex items-center justify-center gap-3 text-primary-foreground">
            <CheckCircle className="h-6 w-6 text-green-400" />
            <span className="text-lg">Thank you for subscribing!</span>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  {...form.register("email")}
                  className="h-12 bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:bg-white/20 focus:border-accent"
                  disabled={subscribeMutation.isPending}
                />
                {form.formState.errors.email && (
                  <p className="text-red-300 text-sm mt-1 text-left">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-12 px-8 bg-accent hover:bg-accent/90 text-accent-foreground"
                disabled={subscribeMutation.isPending}
              >
                {subscribeMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  "Subscribe"
                )}
              </Button>
            </div>
          </form>
        )}

        <p className="mt-4 text-sm text-primary-foreground/60">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
