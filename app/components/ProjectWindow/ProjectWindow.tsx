"use client";

import Image from "next/image";
import { useState } from "react";
import { useTheme } from "@/app/Features/Theme/ThemeProvider";
import { windowThemes } from "@/app/Features/Window/windowThemes";
import { projectImage } from "@/app/Features/Images/actions";
import type { DisplayProject } from "@/app/Features/Projects/types";
import styles from "./ProjectWindow.module.css";

type ProjectLayout = "landscape" | "block" | "mobile";

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
  const [layout, setLayout] = useState<ProjectLayout>("landscape");

  const imageClass = {
    landscape: styles.landscapeImage,
    block: styles.blockImage,
    mobile: styles.mobileImage,
  }[layout];

  const image = (
    <div
      className={`${styles.imageWrapper} ${imageClass} ${selectedTheme.projectImage}`}
    >
      <Image
        src={projectImage.window(imageSrc)}
        alt={title}
        fill
        sizes="(max-width: 900px) 100vw, 700px"
        className={styles.image}
      />
    </div>
  );

  const meta = (
    <div className={styles.meta}>
      <div className={styles.metaGroup}>
        <span className={styles.metaLabel}>Tech used</span>

        <div className={styles.chipList}>
          {tags.map((tag) => (
            <span
              key={tag}
              className={`${styles.tag} ${selectedTheme.projectTag}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.metaGroup}>
        <span className={styles.metaLabel}>Time spent</span>

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

  const descriptionBlock = (
    <div
      className={`${styles.descriptionBlock} ${selectedTheme.projectDescription}`}
    >
      <p className={styles.description}>{description}</p>
    </div>
  );

  return (
    <article className={styles.project}>
      <div className={styles.layoutControls}>
        <button
          type="button"
          className={`${styles.layoutButton} ${selectedTheme.button}`}
          onClick={() => setLayout("landscape")}
        >
          Landscape
        </button>

        <button
          type="button"
          className={`${styles.layoutButton} ${selectedTheme.button}`}
          onClick={() => setLayout("block")}
        >
          Block
        </button>

        <button
          type="button"
          className={`${styles.layoutButton} ${selectedTheme.button}`}
          onClick={() => setLayout("mobile")}
        >
          Mobile
        </button>
      </div>

      {layout === "landscape" && (
        <section className={styles.landscapeLayout}>
          <h2 className={styles.title}>{title}</h2>

          <div className={styles.landscapeGrid}>
            {image}

            <div className={styles.sideInfo}>
              {meta}

              <span className={styles.sectionTitle}>Description</span>
              {descriptionBlock}
            </div>
          </div>
        </section>
      )}

      {layout === "block" && (
        <section className={styles.blockLayout}>
          <div className={styles.mediaColumn}>
            {image}
            {meta}
          </div>

          <div className={styles.contentColumn}>
            <h2 className={styles.title}>{title}</h2>
            <span className={styles.sectionTitle}>Description</span>
            {descriptionBlock}
          </div>
        </section>
      )}

      {layout === "mobile" && (
        <section className={styles.mobileLayout}>
          <div className={styles.mobileMediaColumn}>{image}</div>

          <div className={styles.contentColumn}>
            <h2 className={styles.title}>{title}</h2>
            {meta}

            <span className={styles.sectionTitle}>Description</span>
            {descriptionBlock}
          </div>
        </section>
      )}
    </article>
  );
}