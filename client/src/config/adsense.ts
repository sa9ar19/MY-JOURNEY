export const ADSENSE_CONFIG = {
  clientId: "ca-pub-1718972165989515",
  slots: {
    blogHeader: "1234567890",
    blogContent: "2345678901",
    galleryInfeed: "3456789012",
    sidebar: "4567890123",
    footer: "5678901234",
  },
  enabled: process.env.NODE_ENV === "production", // Only show in production
};

export function shouldShowAds() {
  return ADSENSE_CONFIG.enabled;
}