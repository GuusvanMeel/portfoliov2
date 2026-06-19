"use client";

import Image from "next/image";
import { useState } from "react";
import { useTheme } from "@/app/Features/Theme/ThemeProvider";
import { windowThemes } from "@/app/Features/Window/windowThemes";
import { projectImage } from "@/app/Features/Images/actions";
import type { DisplayProject } from "@/app/Features/Projects/types";
import styles from "./ProjectWindow.module.css";

type ProjectLayout = "side" | "wide" | "compact";

export default function ProjectWindow({
  title,
  description,
  tags,
  imageSrc,
  duration,
  githubLink,
}: Readonly<DisplayProject>) {
  const { theme } = useTheme();
  const selectedTheme = windowThemes[theme];
  const [layout, setLayout] = useState<ProjectLayout>("side");

  const meta = (
    <div className={styles.meta}>
      <div className={styles.tags}>
        <span className={styles.metaLabel}>Tech used:</span>

        {tags.map((tag) => (
          <span
            key={tag}
            className={`${styles.tag} ${selectedTheme.projectTag}`}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className={styles.durationRow}>
        <span className={styles.metaLabel}>Duration:</span>
        <span className={`${styles.duration} ${selectedTheme.projectDuration}`}>
          {duration}
        </span>
      </div>

      {githubLink && (
        <a
          href={githubLink}
          target="_blank"
          rel="noreferrer"
          className={`${styles.link} ${selectedTheme.projectLink}`}
        >
          ◈ View source on GitHub
        </a>
      )}
    </div>
  );

  const image = (
    <div className={`${styles.imageWrapper} ${selectedTheme.projectImage}`}>
      <Image
        src={projectImage.window(imageSrc)}
        alt={title}
        width={1000}
        height={700}
        className={styles.image}
      />
    </div>
  );

  const descriptionBlock = (
    <div
      className={`${styles.descriptionBlock} ${selectedTheme.projectDescription}`}
    >
      <p className={styles.description}>{description}</p>
    </div>
  );

  return (
    <div className={styles.project}>
      <div className={styles.layoutControls}>
        <button
          type="button"
          className={`${styles.layoutButton} ${selectedTheme.button}`}
          onClick={() => setLayout("side")}
        >
          Layout 1
        </button>

        <button
          type="button"
          className={`${styles.layoutButton} ${selectedTheme.button}`}
          onClick={() => setLayout("wide")}
        >
          Layout 2
        </button>

        <button
          type="button"
          className={`${styles.layoutButton} ${selectedTheme.button}`}
          onClick={() => setLayout("compact")}
        >
          Layout 3
        </button>
      </div>

      {layout === "side" && (
        <section className={styles.sideLayout}>
          <div className={styles.leftColumn}>
            {image}
            {meta}
          </div>

          <div className={styles.rightColumn}>
            <h2 className={styles.title}>{title}</h2>
            <span className={styles.sectionTitle}>Description</span>
            {descriptionBlock}
          </div>
        </section>
      )}

      {layout === "wide" && (
        <section className={styles.wideLayout}>
          {image}

          <div className={styles.wideBottom}>
            <div>
              <span className={styles.sectionTitle}>Description</span>
              {descriptionBlock}
            </div>

            {meta}
          </div>
        </section>
      )}

      {layout === "compact" && (
        <section className={styles.compactLayout}>
          <div>
            <h2 className={styles.title}>{title}</h2>
            {descriptionBlock}
          </div>

          <div>
            {image}
            {meta}
          </div>
        </section>
      )}
    </div>
  );
}