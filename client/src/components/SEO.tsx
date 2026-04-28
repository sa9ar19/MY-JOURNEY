import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  keywords?: string;
}

export default function SEO({
  title = "My Journey | Travel & Photography",
  description = "A personal journey through travel, trekking, and life experiences captured in photos and stories.",
  image = "/images/profile.jpg",
  url = window.location.href,
  type = "website",
  keywords = "travel, photography, trekking, blog, gallery",
}: SEOProps) {
  const siteTitle = title.includes("My Journey") ? title : `${title} | My Journey`;
  const fullImageUrl = image.startsWith("http") ? image : `${window.location.origin}${image}`;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImageUrl} />

      {/* Google Images SEO - Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === "article" ? "BlogPosting" : "WebPage",
          "name": siteTitle,
          "description": description,
          "image": fullImageUrl,
          "url": url,
        })}
      </script>
    </Helmet>
  );
}