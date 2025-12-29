"use client";

import styles from "./page.module.css";
import "./theme.css";

import { useState, useCallback } from "react";
import { AI_FEATURES } from "@/constants/aiFeatures";
import { useFeatureData } from "@/hooks/useFeatureData";


import SearchBarBody from "@/features/search/components/SearchBarBody";
import SearchFooter from "@/features/search/components/SearchFooter";
import { FeatureInsights } from "@/components/search/FeatureInsights";
import { Navbar } from "@/components/layouts/Navbax";
import { SideDrawer } from "@/components/layouts/SideDrawer";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data, loading, fetchFeature } = useFeatureData();

  const handleFeatureClick = useCallback(
    (name: string) => {
      const feature = AI_FEATURES.find(f => f.name === name);
      if (feature) fetchFeature(feature.name, feature.key);
    },
    [fetchFeature]
  );

  return (
    <div className={styles.page}>
      <Navbar styles={styles} onMenuClick={() => setMenuOpen(true)} />
      <SideDrawer styles={styles} open={menuOpen} onClose={() => setMenuOpen(false)} />

      <SearchBarBody
        styles={styles}
        aiFeatures={AI_FEATURES.map(f => f.name)}
        handleFeatureClick={handleFeatureClick}
      />

      <FeatureInsights loading={loading} data={data} />

      <SearchFooter styles={styles} />
    </div>
  );
}
