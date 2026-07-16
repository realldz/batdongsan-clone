"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-store";
import { getRecommendations, pickByType } from "@/services/recommendations";
import { propertyToPropertyData } from "@/adapters/property-adapters";
import { PropertyGrid } from "@/components/PropertyGrid/PropertyGrid";
import type { PropertyData } from "@/types";
import type { PropertyType } from "@/services/properties";

interface RecommendationSectionProps {
  title: string;
  type?: PropertyType;
  fallback: PropertyData[];
}

export function RecommendationSection({ title, type, fallback }: RecommendationSectionProps) {
  const { isLoading: authLoading } = useAuth();
  const [properties, setProperties] = useState<PropertyData[]>(fallback);

  useEffect(() => {
    if (authLoading) return; // chờ auth resolve, KHÔNG chặn guest

    let cancelled = false;

    async function fetchRecommendations() {
      try {
        const data = await getRecommendations();
        const chosen = pickByType(data, type);
        if (!cancelled && chosen.length > 0) {
          setProperties(chosen.map(propertyToPropertyData));
        }
      } catch {
        // giữ fallback, không hiện lỗi cho section phụ
      }
    }

    fetchRecommendations();

    return () => {
      cancelled = true;
    };
  }, [authLoading, type]);

  if (properties.length === 0) return null;

  return <PropertyGrid title={title} properties={properties} />;
}
