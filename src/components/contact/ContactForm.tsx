import React, { useState } from "react";
import GoldButton from "@/components/GoldButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const ContactForm = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, subject: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulation d'envoi du message
    setTimeout(() => {
      toast({
        title: t("contact.messageSent"),
        description: t("contact.messageResponse"),
      });

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      setIsLoading(false);
    }, 1500);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-lg border border-gray-200"
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-vip-gray-700 mb-1"
        >
          {t("contact.form.name")}
        </label>
        <Input
          id="name"
          placeholder={t("contact.form.namePlaceholder")}
          className="bg-white border-gray-300"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-vip-gray-700 mb-1"
        >
          {t("contact.form.email")}
        </label>
        <Input
          id="email"
          type="email"
          placeholder={t("contact.form.emailPlaceholder")}
          className="bg-white border-gray-300"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-vip-gray-700 mb-1"
        >
          {t("contact.form.subject")}
        </label>
        <Select
          value={formData.subject}
          onValueChange={handleSelectChange}
          required
        >
          <SelectTrigger className="bg-white border-gray-300">
            <SelectValue placeholder={t("contact.form.subjectPlaceholder")} />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-300">
            <SelectItem value="Demande d'information">
              {t("contact.form.subjects.info")}
            </SelectItem>
            <SelectItem value="Inscription client">
              {t("contact.form.subjects.client")}
            </SelectItem>
            <SelectItem value="Inscription partenaire">
              {t("contact.form.subjects.partner")}
            </SelectItem>
            <SelectItem value="Support technique">
              {t("contact.form.subjects.support")}
            </SelectItem>
            <SelectItem value="Signaler un problème">
              {t("contact.form.subjects.problem")}
            </SelectItem>
            <SelectItem value="Autre">
              {t("contact.form.subjects.other")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-vip-gray-700 mb-1"
        >
          {t("contact.form.message")}
        </label>
        <Textarea
          id="message"
          placeholder={t("contact.form.messagePlaceholder")}
          className="bg-white border-gray-300 min-h-[150px]"
          value={formData.message}
          onChange={handleChange}
          required
        />
      </div>

      <GoldButton type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Sending" : "Envoyer"}
      </GoldButton>
    </form>
  );
};

export default ContactForm;
