import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GoldButton from "@/components/GoldButton";
import { useRequests } from "@/hooks/useRequests";

const formSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  category: z.string().min(1, "La catégorie est requise"),
  budget: z.string().optional(),
  deadline: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const RequestForm = () => {
  const { createRequest, isLoading } = useRequests();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      budget: "",
      deadline: ""
    }
  });

  const onSubmit = async (data: FormValues) => {
    await createRequest({
      title: data.title,
      description: data.description,
      category: data.category,
      budget: data.budget ? parseFloat(data.budget) : undefined,
      deadline: data.deadline || undefined
    });
    form.reset();
  };

  return (
    <Card className="bg-vip-gray-900 border-vip-gray-800">
      <CardHeader>
        <CardTitle className="text-vip-white">Nouvelle demande</CardTitle>
        <CardDescription className="text-vip-gray-400">
          Décrivez votre besoin pour recevoir des propositions de nos partenaires VIP
        </CardDescription>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-vip-gray-300">Titre de votre demande</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: Recherche DJ pour mariage" 
                      className="bg-vip-gray-800 border-vip-gray-700"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-vip-gray-300">Catégorie</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-vip-gray-800 border-vip-gray-700">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-vip-gray-800 border-vip-gray-700">
                        <SelectItem value="Lieu">Lieu</SelectItem>
                        <SelectItem value="Traiteur">Traiteur</SelectItem>
                        <SelectItem value="Animation">Animation</SelectItem>
                        <SelectItem value="Photographie">Photographie</SelectItem>
                        <SelectItem value="Décoration">Décoration</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-vip-gray-300">Budget (€)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="Votre budget"
                        className="bg-vip-gray-800 border-vip-gray-700"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-vip-gray-300">Date limite</FormLabel>
                    <FormControl>
                      <Input 
                        type="date"
                        className="bg-vip-gray-800 border-vip-gray-700"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-vip-gray-300">Description détaillée</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Décrivez votre besoin en détail..."
                      className="bg-vip-gray-800 border-vip-gray-700 min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          
          <CardFooter>
            <GoldButton type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Envoi en cours..." : "Envoyer ma demande"}
            </GoldButton>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default RequestForm;
