import React, { useRef, useEffect } from "react";
import styles from "../styles/features.module.css";

interface AIFeatureBarProps {
  aiFeatures: string[];
  handleFeatureClick: (feature: string) => void;
}

const AIFeatureBar: React.FC<AIFeatureBarProps> = ({
  aiFeatures,
  handleFeatureClick,
}) => {
  const blobRef = useRef<HTMLSpanElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Set CSS vars on blob for target (x,y,width,height)
  const moveBlob = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const blob = blobRef.current;
    const container = containerRef.current;
    if (!btn || !blob || !container) return;

    const btnRect = btn.getBoundingClientRect();
    const parentRect = container.getBoundingClientRect();

    const x = btnRect.left - parentRect.left;
    const y = btnRect.top - parentRect.top;
    const w = btnRect.width;
    const h = btnRect.height;

    // remove settle class so blob stretches while moving
    blob.classList.remove(styles.settled);

    // Set css vars (px values)
    blob.style.setProperty("--tx", `${Math.round(x)}px`);
    blob.style.setProperty("--ty", `${Math.round(y)}px`);
    blob.style.setProperty("--bw", `${Math.round(w)}px`);
    blob.style.setProperty("--bh", `${Math.round(h)}px`);

    // Optional: slightly wider when hovering to look "wet"
    blob.style.setProperty("--sx", "1.08");
    blob.style.setProperty("--sy", "0.95");
  };

  // shrink blob when leaving container (or you can keep it at last pos)
  const hideBlob = () => {
    const blob = blobRef.current;
    if (!blob) return;
    blob.style.setProperty("--sx", "1");
    blob.style.setProperty("--sy", "1");
    // shrink to small circle in center
    blob.style.setProperty("--bw", `8px`);
    blob.style.setProperty("--bh", `8px`);
    // center
    blob.style.setProperty("--tx", `calc(50% - 4px)`);
    blob.style.setProperty("--ty", `calc(50% - 4px)`);
  };

  // When transitions end, trigger a small settle wobble for natural feel
  useEffect(() => {
    const blob = blobRef.current;
    if (!blob) return;

    const onEnd = (ev: TransitionEvent) => {
      // only trigger on transform/width/height end
      if (ev.propertyName === "transform" || ev.propertyName === "width" || ev.propertyName === "height") {
        // add settled class which runs one-shot wobble animation
        // small delay to avoid immediate wobble during motion
        requestAnimationFrame(() => blob.classList.add(styles.settled));
      }
    };

    blob.addEventListener("transitionend", onEnd);
    return () => blob.removeEventListener("transitionend", onEnd);
  }, []);

  return (
    <div
      ref={containerRef}
      className={styles.aiFeatures}
      onMouseLeave={hideBlob}
      aria-hidden={false}
    >
      <span ref={blobRef} className={styles.liquidBlob} />
      {aiFeatures.map((feature) => (
        <button
          key={feature}
          type="button"
          className={styles.featureButton}
          onMouseEnter={moveBlob}
          onClick={() => handleFeatureClick(feature)}
        >
          {feature}
        </button>
      ))}
    </div>
  );
};

export default AIFeatureBar;
