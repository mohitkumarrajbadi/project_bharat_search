import { useEffect, useRef } from "react";

interface Props {
  styles: Record<string, string>;
  open: boolean;
  onClose: () => void;
}

export const SideDrawer = ({ styles, open, onClose }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  return (
    <div
      ref={ref}
      className={`${styles.sideDrawer} ${
        open ? styles.sideDrawerOpen : ""
      }`}
    >
      <ul>
        <li>Chats</li>
        <li>AI Agents</li>
        <li>Settings</li>
        <li>About</li>
      </ul>
    </div>
  );
};
