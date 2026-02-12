interface BlockRendererProps {
  blockKey: string;
  data: any;
  companyInfo?: any;
  calculated?: any;
}

export const BlockRenderer = ({
  blockKey,
  data,
  companyInfo,
  calculated,
}: BlockRendererProps) => {
  switch (blockKey) {
    case "hero-image":
      return (
        <div
          className="w-full"
          style={{
            height: data.height || "100vh",
            backgroundImage: `url(${data.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      );

    case "big-title":
      return (
        <div className="text-center py-24">
          <h1 className="text-5xl font-serif mb-4">{data.text}</h1>
          <p className="italic text-xl">{data.subtitle}</p>
        </div>
      );

    case "image-gallery":
      return (
        <div className={`grid grid-cols-${data.columns} gap-6`}>
          {data.images?.map((img) => (
            <img
              key={img.url}
              src={img.url}
              className="rounded-lg object-cover"
            />
          ))}
        </div>
      );

    case "testimonials":
      return (
        <div className="grid grid-cols-2 gap-6">
          {data.items.map((t) => (
            <div className="bg-white rounded-xl p-6 shadow">
              <p className="italic mb-2">“{t.text}”</p>
              <span className="font-semibold">{t.name}</span>
            </div>
          ))}
        </div>
      );

    case "features":
      return (
        <div className="grid grid-cols-2 gap-8">
          {data.items.map((f) => (
            <div className="text-center">
              <img
                src={f.image}
                className="w-32 h-32 rounded-full mx-auto mb-3"
              />
              <h3 className="font-semibold">{f.title}</h3>
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
};
s;
