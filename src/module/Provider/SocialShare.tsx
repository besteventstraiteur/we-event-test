import { InlineShareButtons } from "sharethis-reactjs";

export default function ProviderShare({ provider }) {
  const shareUrl = `${import.meta.env.VITE_FRONTEND_URL}/${provider?.id}`;
  const shareText = `${provider?.name} - ${provider?.description}`;

  return (
    <div>
      <InlineShareButtons
        config={{
          alignment: "left",
          color: "social",
          enabled: true,
          font_size: 16,
          labels: "cta",
          language: "en",
          networks: ["facebook", "twitter", "linkedin", "whatsapp"],
          padding: 12,
          radius: 50,
          show_total: false,
          size: 40,
          url: shareUrl,
          description: shareText,
          title: provider?.name,
        }}
      />
    </div>
  );
}
