"use client";

import styles from "./DesktopIcon.module.css";

type DesktopIconProps = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  iconSrc?: string;
  selected: boolean;
  onSelect: (id: string) => void;
  onOpen: () => void;
};

export default function DesktopIcon({
  id,
  label,
  icon,
  iconSrc,
  selected,
  onSelect,
  onOpen,
}: Readonly<DesktopIconProps>) {
  return (
    <button
      type="button"
      data-desktop-icon
      className={`${styles.desktopIcon} ${selected ? styles.selected : ""}`}
      onClick={() => onSelect(id)}
      onDoubleClick={onOpen}
      aria-pressed={selected}
    >
      <span className={styles.iconBox}>
        {iconSrc ? (
          <img src={iconSrc} alt="" className={styles.iconImage} />
        ) : (
          icon ?? "▣"
        )}
      </span>

      <span className={styles.label}>{label}</span>
    </button>
  );
}