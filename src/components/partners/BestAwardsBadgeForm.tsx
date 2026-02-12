
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trophy, CheckCircle } from "lucide-react";
import GoldButton from "@/components/GoldButton";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

const bestAwardsFormSchema = z.object({
  partnerName: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Email invalide" }),
  phone: z.string().min(10, { message: "Numéro de téléphone invalide" }),
  reviewLink1: z.string().url({ message: "Lien invalide" }).includes("http", { message: "Le lien doit commencer par http:// ou https://" }),
  reviewLink2: z.string().url({ message: "Lien invalide" }).includes("http", { message: "Le lien doit commencer par http:// ou https://" }).optional().or(z.literal("")),
  reviewLink3: z.string().url({ message: "Lien invalide" }).includes("http", { message: "Le lien doit commencer par http:// ou https://" }).optional().or(z.literal("")),
  comment: z.string().optional(),
});

type BestAwardsFormValues = z.infer<typeof bestAwardsFormSchema>;

const BestAwardsBadgeForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<BestAwardsFormValues>({
    resolver: zodResolver(bestAwardsFormSchema),
    defaultValues: {
      partnerName: "",
      email: "",
      phone: "",
      reviewLink1: "",
      reviewLink2: "",
      reviewLink3: "",
      comment: "",
    },
  });

  const onSubmit = async (values: BestAwardsFormValues) => {
    setIsSubmitting(true);
    
   
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast({
        title: "Candidature soumise !",
        description: "Nous examinerons vos avis et vous contacterons prochainement.",
      });
    }, 1500);
  };

  if (isSuccess) {
    return (
      <Card className="bg-white shadow-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Candidature reçue !</h3>
            <p className="text-gray-600">
              Merci pour votre candidature au badge Best Awards 2025. Notre équipe va examiner vos avis et vous contactera prochainement.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
            <Trophy className="h-5 w-5 text-amber-600" />
          </div>
          <CardTitle className="text-xl">Obtiens le badge Best Awards 2025</CardTitle>
        </div>
        <CardDescription>
          Tu es un prestataire de qualité ? Prouve-le avec 10 avis 5 étoiles (Google, Mariages.net, Facebook, etc.) et décroche notre label d'excellence.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 bg-amber-50 p-4 rounded-md border border-amber-200">
          <h4 className="font-semibold text-amber-800 mb-2">Comment ça marche ?</h4>
          <ol className="space-y-2 text-amber-700 pl-5 list-decimal">
            <li>Obtiens 10 avis 5 étoiles sur la plateforme de ton choix.</li>
            <li>Remplis le formulaire ci-dessous avec les liens vers les avis.</li>
            <li>Si c'est validé par notre équipe, tu reçois ton badge Best Awards à afficher fièrement !</li>
          </ol>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="partnerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du prestataire</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre nom ou celui de votre entreprise" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="votre@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input placeholder="0612345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="reviewLink1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lien vers les avis 5 étoiles (obligatoire)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://google.com/business/..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Lien vers Google, Mariages.net, Facebook, etc.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="reviewLink2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lien supplémentaire (optionnel)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://mariages.net/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="reviewLink3"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Autre lien (optionnel)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://facebook.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commentaire (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Informations complémentaires sur votre activité..." 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <GoldButton 
              className="w-full" 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Envoi en cours..." : "Soumettre ma candidature"}
            </GoldButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BestAwardsBadgeForm;
