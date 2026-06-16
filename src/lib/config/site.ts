const PRODUCTION_URL = "https://oya.securemineidentity.com";

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (configured) return configured;
  if (process.env.NODE_ENV === "production") return PRODUCTION_URL;
  return "http://127.0.0.1:3200";
}

export const SITE_NAME = "Secure Registry & Verification Portal";

export const PRODUCTION_SITE_URL = PRODUCTION_URL;
