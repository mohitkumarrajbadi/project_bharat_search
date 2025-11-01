"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./page.module.css";
import SearchHeader from "@/features/search/components/SearchHeader";
import SearchFooter from "@/features/search/components/SearchFooter";
import './theme.css'

export default function Home() {
  const aiFeatures = [
    { name: "Weather Updates", key: "weather" },
    { name: "Finance Insights", key: "finance" },
    { name: "Sports Updates", key: "sports" },
    { name: "Farmers Info", key: "farmers" },
    { name: "Health Tips", key: "health" },
    { name: "Education", key: "education" },
  ];

  const [menuOpen, setMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Feature selection & data
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [featureData, setFeatureData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Close drawer on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Handle Feature Click — Fetch API data
  const handleFeatureClick = async (featureName: string) => {
    const feature = aiFeatures.find(f => f.name === featureName);
    if (!feature) return;

    setSelectedFeature(featureName);
    setLoading(true);
    setFeatureData(null);

    try {
      const response = await fetch(`/api/${feature.key}`);
      if (!response.ok) throw new Error("API failed");
      const data = await response.json();
      setFeatureData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setFeatureData({ error: "Failed to fetch data" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* ===== Navbar ===== */}
      <div className={styles.navbar}>
        <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>

      {/* ===== Side Drawer ===== */}
      <div
        ref={drawerRef}
        className={`${styles.sideDrawer} ${menuOpen ? styles.sideDrawerOpen : ""}`}
      >
        <ul>
          <li>Chats</li>
          <li>AI Agents</li>
          <li>Settings</li>
          <li>About</li>
        </ul>
      </div>

      {/* ===== Header ===== */}
      <SearchHeader
        styles={styles}
        aiFeatures={aiFeatures.map(f => f.name)}
        handleFeatureClick={handleFeatureClick}
      />

      {/* ===== Insights Section ===== */}
      {/* Place holder for the Insights after clicking on the AI Features updates */}

      <SearchFooter styles={styles} />
    </div>
  );
}
