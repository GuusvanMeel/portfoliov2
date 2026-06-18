"use client";

import Image from "next/image";
import { useTheme } from "@/app/Features/Theme/ThemeProvider";
import { windowThemes } from "@/app/Features/Window/windowThemes";
import styles from "./ProjectWindow.module.css";
import { projectImage } from "../Features/Images/actions";
import { DisplayProject } from "../Features/Projects/types";



export default function ProjectWindow({
  id,
    title,
  description,
  tags,
  imageSrc,
  duration,
  githubLink,
}: Readonly<DisplayProject>) {
  const { theme } = useTheme();
  const selectedTheme = windowThemes[theme];

  return (
    <div className={styles.project}>
      <aside className={styles.sidebar}>
        <div className={`${styles.imageWrapper} ${selectedTheme.projectImage}`}>
          <Image
            src={projectImage.window(imageSrc)}
            alt={title}
            width={1000}
            height={700}
            className={styles.image}
          />
        </div>

        <div className={styles.tags}>
  <span className={styles.tagLabel}>Tech used:</span>

  {tags.map((tag) => (
    <span
      key={tag}
      className={`${styles.tag} ${selectedTheme.projectTag}`}
    >
      {tag}
    </span>
  ))}

  <span className={`${styles.duration} ${selectedTheme.projectDuration}`}>
    Time spent: {duration}
  </span>
</div>

        

       {githubLink && (
  <a
    href={githubLink}
    target="_blank"
    rel="noreferrer"
    className={`${styles.link} ${selectedTheme.projectLink}`}
  >
    ◈ View on GitHub
  </a>
)}
      </aside>

      <section className={styles.main}>
        <h2 className={styles.title}>{title}</h2>

        <div className={`${styles.descriptionBlock} ${selectedTheme.projectDescription}`}>
          <p className={styles.description}>{description}</p>
        </div>
      </section>
    </div>
  );
}