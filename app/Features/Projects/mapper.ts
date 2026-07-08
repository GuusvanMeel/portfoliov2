import { Project, ProjectRow, ProjectInputData, DisplayProject } from "./types"



export function mapProjectRowToProject(row: ProjectRow): Project {
    return {
        id: row.id,
        title: row.title,
        description: row.description,
        imageSrc: row.imagesrc,
        githubLink: row.Github_Link,
        duration: row.duration,
        tags: row.tags ?? [],
        isVisible: row.is_visible,
        updatedAt: row.updated_at,
        desktopIconSrc: row.desktop_icon_src,
    };
}

export function mapUpdateProjectInputToRow(input: ProjectInputData) {
    return {
        title: input.title,
        description: input.description,
        tags: input.tags,
        duration: input.duration,
        imagesrc: input.imageSrc,
        Github_Link: input.githubLink,
        is_visible: input.isVisible,
        updated_at: new Date().toISOString(),
    }
}
export function mapProjectToDisplayproject(
  project: Project
): DisplayProject {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    tags: project.tags,
    duration: project.duration,
    imageSrc: project.imageSrc,
    githubLink: project.githubLink,
    desktopIconSrc: project.desktopIconSrc,
  };
}
