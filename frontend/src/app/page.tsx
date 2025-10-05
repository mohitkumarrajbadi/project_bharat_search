"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./page.module.css";

export default function Home() {
  const aiFeatures = [
    "Real-time News",
    "Finance Insights",
    "Sports Updates",
    "Entertainment",
    "Travel Guides",
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
        className={`${styles.sideDrawer} ${
          menuOpen ? styles.sideDrawerOpen : ""
        }`}
      >
        <ul>
          <li>Chats</li>
          <li>AI Agents</li>
          <li>Settings</li>
          <li>About</li>
        </ul>
      </div>

      <header className={styles.hero}>
        <h1 className={styles.title}>Project Bharat Search</h1>
        <p className={styles.subtitle}>
          India-scale AI-powered search engine for fast, intelligent, multilingual search.
        </p>

        {/* Centered Search */}
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search BharatSearch..."
            className={styles.searchInput}
          />
          <button className={styles.searchButton}>Search</button>
        </div>

        {/* AI Feature Buttons */}
        <div className={styles.aiFeatures}>
          {aiFeatures.map((feature) => (
            <button
              key={feature}
              className={styles.featureButton}
              onClick={() => handleFeatureClick(feature)}
            >
              {feature}
            </button>
          ))}
        </div>
      </header>

      <footer className={styles.footer}>
        © {new Date().getFullYear()} BharatSearch. All rights reserved.
      </footer>
    </div>
  );
}
