"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./page.module.css";
import SearchHeader from "@/features/search/components/SearchHeader";
import SearchFooter from "@/features/search/components/SearchFooter";

export default function Home() {
  const aiFeatures = [
    "Weather Updates",
    "Finance Insights",
    "Sports Updates",
    "Farmers Info",
    "Health Tips",
    "Education",
  ];

  const [menuOpen, setMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleFeatureClick = (feature: string) => {
    alert(`Feature clicked: ${feature}`);
  };

return (
  <div className={styles.page}>
    {/* Hamburger Navbar */}
    <div className={styles.navbar}>
      <button
        className={styles.hamburger}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>
    </div>

    {/* Side Drawer */}
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

    <SearchHeader
      styles={styles}
      aiFeatures={aiFeatures}
      handleFeatureClick={handleFeatureClick}
    />

    <SearchFooter styles={styles} />

  </div>
);
}
