export const ENV = {
  appId: process.env.VITE_APP_ID ?? "app_personal_website_123",
  cookieSecret:
    process.env.JWT_SECRET ?? "ujmlWkMVOaxOx9GkUO5uYohdqI31ESYOYMof72FlQ6P",
  databaseUrl:
    process.env.DATABASE_URL ??
    "postgresql://postgres:YerEDAUGQRxvmIgHZHQbBiNHRRKQmWkl@postgres.railway.internal:5432/railway",

  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "https://api.manus.im",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",

  username: process.env.ADMIN_USERNAME ?? "sa9ar",
  password: process.env.ADMIN_PASSWORD ?? "R0s3D@ffodil",
  adminSecret:
    process.env.ADMIN_SECRET ?? "ujmlWkMVOaxOx9GkUO5uYohdqI31ESYOYMof72FlQ6P",

  // Add these for Cloudinary if they aren't in your ENV object yet
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "dhdi0rhct",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY ?? "873821838528726",
  cloudinaryApiSecret:
    process.env.CLOUDINARY_API_SECRET ?? "JK23d1ZiUDMV6zcXk4wCgQRjIaw",

  user: process.env.GMAIL_USER ?? "khadka.sa9ar@gmail.com", // khadka.sa9ar@gmail.com
  pass: process.env.GMAIL_APP_PASSWORD ?? "idcb lzaa jaxt tdhx",
};
