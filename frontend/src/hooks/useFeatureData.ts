import { useState, useCallback } from "react";

export function useFeatureData() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchFeature = useCallback(async (name: string, key: string) => {
    setSelectedFeature(name);
    setLoading(true);
    setData(null);

    try {
      const res = await fetch(`/api/${key}`);
      if (!res.ok) throw new Error();
      setData(await res.json());
    } catch {
      setData({ error: "Failed to fetch data" });
    } finally {
      setLoading(false);
    }
  }, []);

  return { selectedFeature, data, loading, fetchFeature };
}
