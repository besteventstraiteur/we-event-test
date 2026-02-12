
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface MetaTagsProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

const MetaTags: React.FC<MetaTagsProps> = ({ 
  title, 
  description, 
  image = 'https://weevent.app/og-image.jpg',
  url = window.location.href 
}) => {
  const siteName = 'WeEvent';
  const fullTitle = `${title} | ${siteName}`;

  return (
    <Helmet>
      {/* Standards */}
      <html lang="fr" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Accessibilité */}
      <meta name="application-name" content={siteName} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional accessibility meta tags */}
      <meta name="theme-color" content="#ffffff" />
      <meta name="color-scheme" content="light" />
    </Helmet>
  );
};

export default MetaTags;
