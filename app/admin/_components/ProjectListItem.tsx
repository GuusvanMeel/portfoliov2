"use client";

import { Eye, EyeOff, FolderGit2, Pencil, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import ProjectFormDialog from "@/app/admin/_components/ProjectFormDialog";
import ProjectThumb from "@/app/admin/_components/ProjectThumb";
import { messages } from "@/content/en";
import { projectImage } from "@/features/images/imageUrls";
import { deleteProject, updateProjectVisibility } from "@/features/projects/actions";
import type { Project } from "@/features/projects/types";
import { useEscapeKey } from "@/hooks/useEscapeKey";

type View = "list" | "grid";

const text = messages.admin.item;

export default function ProjectListItem({
  project,
  view = "list",
}: Readonly<{
  project: Project;
  view?: View;
}>) {
  const [localProject, setLocalProject] = useState<Project>(project);
  const [open, setOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const closeForm = useCallback(() => setOpen(false), []);
  useEscapeKey(closeForm);

  async function handleToggle() {
    const nextIsVisible = !localProject.isVisible;
    try {
      await updateProjectVisibility(localProject.id, nextIsVisible);
      setLocalProject({ ...localProject, isVisible: nextIsVisible });
    } catch (error) {
      console.error("Failed to update visibility:", error);
      alert(text.visibilityFailed);
    }
  }

  async function handleDelete() {
    const sure = globalThis.confirm(text.confirmDelete);
    if (!sure) return;
    try {
      await deleteProject(localProject.id);
      setIsDeleted(true);
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert(text.deleteFailed);
    }
  }

  if (isDeleted) return null;

  const hasGithub = Boolean(localProject.githubLink);

  const VisibilityPill = (
    <span
      data-cy="visibility-pill"
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full border ${
        localProject.isVisible
          ? "border-green-700/60 text-green-400 bg-green-900/20"
          : "border-red-700/60 text-red-400 bg-red-900/20"
      }`}
    >
      {localProject.isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
      {localProject.isVisible ? text.visible : text.hidden}
    </span>
  );

  const ActionButtons = (
    <div className="flex items-center gap-2">
      {hasGithub && (
        <a
          href={localProject.githubLink}
          target="_blank"
          rel="noopener noreferrer"
          title={text.openGithub}
          className="p-3 text-neutral-300 bg-neutral-900 border border-neutral-700 rounded-md hover:bg-neutral-800 hover:text-white transition"
        >
          <FolderGit2 size={18} />
        </a>
      )}
      <button
        data-cy="visibility-toggle"
        onClick={handleToggle}
        title={localProject.isVisible ? text.hide : text.show}
        className="p-3 text-neutral-300 bg-neutral-900 border border-neutral-700 rounded-md hover:bg-neutral-800 hover:text-white transition"
      >
        {localProject.isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
      <button
        data-cy="edit-project"
        onClick={() => setOpen(true)}
        title={text.edit}
        className="p-3 text-neutral-300 bg-neutral-900 border border-neutral-700 rounded-md hover:bg-neutral-800 hover:text-white transition"
      >
        <Pencil size={15} />
      </button>
      <button
        data-cy="delete-project"
        onClick={handleDelete}
        title={text.delete}
        className="p-3 text-red-500 border border-red-700/70 rounded-md hover:bg-red-900/40 hover:text-red-300 transition"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );

  const EditModal = open && (
    <ProjectFormDialog
      project={localProject}
      onSaved={(updated) => {
        setLocalProject(updated);
        setOpen(false);
      }}
      onClose={closeForm}
    />
  );

  if (view === "grid") {
    return (
      <div
        data-cy="admin-project"
        data-project-id={localProject.id}
        className="group flex flex-col bg-neutral-900/60 border border-neutral-800 rounded-lg overflow-hidden hover:border-neutral-700 transition"
      >
        <ProjectThumb
          imageSrc={projectImage.grid(localProject.imageSrc)}
          className="w-full aspect-video object-cover border-b border-neutral-800"
        />

        <div className="flex flex-col gap-2 p-4 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-xl font-semibold text-white truncate">{localProject.title}</h2>
            {VisibilityPill}
          </div>

          <p className="text-neutral-400 text-base line-clamp-2 min-h-10">
            {localProject.description}
          </p>

          {localProject.tags && localProject.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {localProject.tags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 text-sm rounded-md bg-neutral-800/80 text-neutral-300 border border-neutral-800"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-end pt-3 mt-auto border-t border-neutral-800/80">
            {ActionButtons}
          </div>
        </div>

        {EditModal}
      </div>
    );
  }

  return (
    <div
      data-cy="admin-project"
      data-project-id={localProject.id}
      className="w-full bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 rounded-lg px-7 py-5 flex items-center gap-4 transition"
    >
      <ProjectThumb
        imageSrc={projectImage.list(localProject.imageSrc)}
        className="w-16 h-16 rounded-md object-cover shrink-0 border border-neutral-800"
      />
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="text-xl font-semibold text-white truncate">{localProject.title}</h2>
          {VisibilityPill}
        </div>
        <p className="text-neutral-400 text-base truncate">{localProject.description}</p>
        {localProject.tags && localProject.tags.length > 0 && (
          <div className="text-neutral-500 text-sm truncate">
            <span className="text-neutral-400">{localProject.tags.join(", ")}</span>
          </div>
        )}
      </div>

      <div className="shrink-0">{ActionButtons}</div>

      {EditModal}
    </div>
  );
}
