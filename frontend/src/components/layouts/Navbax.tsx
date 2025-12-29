interface Props {
  styles: Record<string, string>;
  onMenuClick: () => void;
}

export const Navbar = ({ styles, onMenuClick }: Props) => {
  return (
    <div className={styles.navbar}>
      <button
        className={styles.hamburger}
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        ☰
      </button>
    </div>
  );
};
