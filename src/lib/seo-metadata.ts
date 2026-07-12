import type { Metadata } from "next";
import type { SeoConfig } from "@/services/seo";

export function seoConfigToMetadata(config: SeoConfig | null, fallback: Metadata): Metadata {
  if (!config) return fallback;

  return {
    ...fallback,
    title: config.title || fallback.title,
    description: config.description || fallback.description,
    keywords: config.keywords || fallback.keywords,
    openGraph: config.ogImage
      ? { ...fallback.openGraph, images: [config.ogImage] }
      : fallback.openGraph,
  };
}

export function truncateForDescription(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).trimEnd()}…`;
}
