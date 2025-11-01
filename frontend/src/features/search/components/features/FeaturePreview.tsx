"use client";

import { useState, useEffect } from "react";
import FeatureCard from "./FeatureCard";
import FeatureSkeleton from "./FeatureSkeleton";

const features = [
  { key: "weather", title: "Weather Updates", description: "Get latest weather insights across India." },
  { key: "finance", title: "Finance Insights", description: "Daily economic and stock insights." },
  { key: "sports", title: "Sports Updates", description: "Cricket and sports news for India." },
  { key: "farmers", title: "Farmers Info", description: "Crop rates and agriculture insights." },
  { key: "health", title: "Health Tips", description: "Daily lifestyle and fitness tips." },
  { key: "education", title: "Education", description: "Education policies and learning news." },
];

export default function FeaturePreview() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const results: Record<string, any> = {};

      await Promise.all(
        features.map(async (feature) => {
          try {
            const res = await fetch(`/api/${feature.key}`);
            const json = await res.json();
            results[feature.key] = json;
          } catch {
            results[feature.key] = { error: "Failed to load" };
          }
        })
      );

      setData(results);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading
        ? Array.from({ length: 6 }).map((_, i) => <FeatureSkeleton key={i} />)
        : features.map((feature) => (
            <FeatureCard
              key={feature.key}
              title={feature.title}
              description={feature.description}
              data={data[feature.key]}
            />
          ))}
    </div>
  );
}
