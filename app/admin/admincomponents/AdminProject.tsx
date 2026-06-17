"use client";
import { Project } from "@/app/Features/Projects/types";
import { useEffect, useState } from "react";
import EditProjectForm from "./editprojectform";
import { deleteProject, updateProjectVisibility } from "@/app/Features/Projects/actions";
import { FolderGit2, Pencil, Trash2, Eye, EyeOff, ImageOff } from "lucide-react";

type View = "list" | "grid";
type ProjectThumbProps = Readonly<{
  imageSrc?: string | null;
  className: string;
}>;
function ProjectThumb({ imageSrc, className }: ProjectThumbProps) {
  const hasImage = Boolean(imageSrc);

  if (hasImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageSrc!}
        alt="Project preview"
        className={className}
      />
    );
  }

  return (
    <div
      className={`${className} flex items-center justify-center bg-neutral-950 text-neutral-600`}
    >
      <ImageOff size={24} />
    </div>
  );
}
export default function AdminProject({
  project,
  view = "list",
  OnCloseCreate,
  OnCreated,
}:Readonly<{
  project: Project | null;
  view?: View;
  OnCloseCreate?: () => void;
  OnCreated?: (project: Project) => void;
}>) {
  const isCreating = project === null;

  const [localProject, setLocalProject] = useState<Project | null>(project);
  const [open, setOpen] = useState<boolean>(isCreating);
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    globalThis.window.addEventListener("keydown", handleKeyDown);

    return () => {
      globalThis.window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  async function handleToggle() {
    if (!localProject) return;
    const nextIsVisible = !localProject.isVisible;
    try {
      await updateProjectVisibility(localProject.id, nextIsVisible);
      setLocalProject({ ...localProject, isVisible: nextIsVisible });
    } catch (error) {
      console.error("Failed to update visibility:", error);
      alert("Could not update project visibility.");
    }
  }

  async function handleDelete() {
    if (!localProject) return;
    const sure = globalThis.confirm("Are you sure you want to delete this project?");
    if (!sure) return;
    try {
      await deleteProject(localProject.id);
      setIsDeleted(true);
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("Could not delete project. Please try again.");
    }
  }

  if (isDeleted) return null;

  if (isCreating && !localProject) {
    return (
      <div className="w-full">
        <EditProjectForm
          project={null}
          Onsaved={(created) => {
            setOpen(false);
            OnCreated?.(created);
            OnCloseCreate?.();
          }}
          Onclose={() => {
            setOpen(false);
            OnCloseCreate?.();
          }}
        />
      </div>
    );
  }

  if (!localProject) return null;

  const hasGithub = Boolean(localProject.githubLink);

  const VisibilityPill = (
    <span data-cy="visibility-pill"
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full border ${localProject.isVisible
        ? "border-green-700/60 text-green-400 bg-green-900/20"
        : "border-red-700/60 text-red-400 bg-red-900/20"
        }`}
    >
      {localProject.isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
      {localProject.isVisible ? "Visible" : "Hidden"}
    </span>
  );

  const ActionButtons = (
    <div className="flex items-center gap-2">
      {hasGithub && (
        <a
          href={localProject.githubLink}
          target="_blank"
          rel="noopener noreferrer"
          title="Open GitHub repo"
          className="p-3 text-neutral-300 bg-neutral-900 border border-neutral-700 rounded-md hover:bg-neutral-800 hover:text-white transition"
        >
          <FolderGit2 size={18} />
        </a>
      )}
      <button data-cy="visibility-toggle"
        onClick={handleToggle}
        title={localProject.isVisible ? "Hide" : "Show"}
        className="p-3 text-neutral-300 bg-neutral-900 border border-neutral-700 rounded-md hover:bg-neutral-800 hover:text-white transition"
      >
        {localProject.isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
      <button data-cy="edit-project"
        onClick={() => setOpen(true)}
        title="Edit"
        className="p-3 text-neutral-300 bg-neutral-900 border border-neutral-700 rounded-md hover:bg-neutral-800 hover:text-white transition"
      >
        <Pencil size={15} />
      </button>
      <button
        data-cy="delete-project"
        onClick={handleDelete}
        title="Delete"
        className="p-3 text-red-500 border border-red-700/70 rounded-md hover:bg-red-900/40 hover:text-red-300 transition"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );



  const EditModal = open && (
    <EditProjectForm
      project={localProject}
      Onsaved={(updated) => {
        setLocalProject(updated);
        setOpen(false);
      }}
      Onclose={() => setOpen(false)}
    />
  );

  // ---------- GRID VIEW ----------
  if (view === "grid") {
    return (
      <div data-cy="admin-project"
  data-project-id={localProject.id} className="group flex flex-col bg-neutral-900/60 border border-neutral-800 rounded-lg overflow-hidden hover:border-neutral-700 transition">
        <ProjectThumb
          imageSrc={localProject.imageSrc}
          className="w-full aspect-video object-cover border-b border-neutral-800"
        />

        <div className="flex flex-col gap-2 p-4 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-xl font-semibold text-white truncate">
              {localProject.title}
            </h2>
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

  // ---------- LIST VIEW ----------
  return (
    <div data-cy="admin-project"
  data-project-id={localProject.id} className="w-full bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 rounded-lg px-7 py-5 flex items-center gap-4 transition">
      <ProjectThumb
        imageSrc={localProject.imageSrc}
        className="w-16 h-16 rounded-md object-cover shrink-0 border border-neutral-800"
      />
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="text-xl font-semibold text-white truncate">
            {localProject.title}
          </h2>
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
