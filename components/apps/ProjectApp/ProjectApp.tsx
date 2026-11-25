"use client";

import Image from "next/image";
import { useState } from "react";
import { projectImage } from "@/features/images/imageUrls";
import type { DisplayProject } from "@/features/projects/types";
import { messages } from "@/content/en";
import { useThemeDefinition } from "@/features/theme/useThemeDefinition";
import styles from "./ProjectApp.module.css";

type ProjectLayout = "landscape" | "block" | "mobile";

const text = messages.apps.project;

const layoutButtons: { layout: ProjectLayout; label: string }[] = [
  { layout: "landscape", label: text.layoutLandscape },
  { layout: "block", label: text.layoutBlock },
  { layout: "mobile", label: text.layoutMobile },
];

export default function ProjectApp({
  title,
  description,
  tags,
  imageSrc,
  duration,
  githubLink,
}: Readonly<DisplayProject>) {
  const { definition } = useThemeDefinition();
  const [layout, setLayout] = useState<ProjectLayout>("landscape");

  const imageClass = {
    landscape: styles.landscapeImage,
    block: styles.blockImage,
    mobile: styles.mobileImage,
  }[layout];

  const image = (
    <section>
      <div className={`${styles.imageWrapper} ${imageClass} ${definition.project.image}`}>
        <Image
          src={projectImage.window(imageSrc)}
          alt={title}
          fill
          sizes="(max-width: 1200px) 100vw, 900px"
          className={styles.image}
        />
      </div>
    </section>
  );

  const meta = (
    <div className={styles.meta}>
      <div className={styles.metaGroup}>
        <span className={styles.metaLabel}>{text.techUsed}</span>

        <div className={styles.chipList}>
          {tags.map((tag) => (
            <span key={tag} className={`${styles.tag} ${definition.project.tag}`}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.metaGroup}>
        <span className={styles.metaLabel}>{text.timeSpent}</span>

        <span className={`${styles.duration} ${definition.project.duration}`}>{duration}</span>
      </div>

      {githubLink && (
        <a
          href={githubLink}
          target="_blank"
          rel="noreferrer"
          className={`${styles.link} ${definition.project.link}`}
        >
          {text.viewSource}
        </a>
      )}
    </div>
  );

  const descriptionBlock = (
    <div className={`${styles.descriptionBlock} ${definition.project.description}`}>
      <div>
        <span className={styles.sectionTitle}>{text.description}</span>

        <div className={`${styles.descriptionBlock} ${definition.project.description}`}>
          <p className={styles.description}>{description}</p>
        </div>
      </div>
    </div>
  );

  return (
    <article className={styles.project}>
      <div className={styles.layoutControls}>
        {layoutButtons.map((button) => (
          <button
            key={button.layout}
            type="button"
            className={`${styles.layoutButton} ${definition.controls.button}`}
            onClick={() => setLayout(button.layout)}
          >
            {button.label}
          </button>
        ))}
      </div>

      {layout === "landscape" && (
        <section className={styles.landscapeLayout}>
          <h2 className={styles.title}>{title}</h2>

          <div className={styles.landscapeGrid}>
            {image}

            <div className={styles.sideInfo}>
              {meta}

              <span className={styles.sectionTitle}>{text.description}</span>
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
            <span className={styles.sectionTitle}>{text.description}</span>
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

            <span className={styles.sectionTitle}>{text.description}</span>
            {descriptionBlock}
          </div>
        </section>
      )}
    </article>
  );
}
