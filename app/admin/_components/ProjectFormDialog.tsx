"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { messages } from "@/content/en";
import { projectImage } from "@/features/images/imageUrls";
import { createProject, updateProject } from "@/features/projects/actions";
import type { Project, ProjectInputData } from "@/features/projects/types";

const text = messages.admin.form;

export default function ProjectFormDialog({
  project,
  onSaved,
  onClose,
}: Readonly<{
  project: Project | null;
  onSaved: (updated: Project) => void;
  onClose: () => void;
}>) {
  const [isPending, startTransition] = useTransition();
  const [isVisible, setIsVisible] = useState(project?.isVisible ?? true);
  const [imagePreview, setImagePreview] = useState(project?.imageSrc ?? "");
  const [imageError, setImageError] = useState(false);
  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const payload: ProjectInputData = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        tags:
          (formData.get("tags") as string)
            ?.split(",")
            .map((t) => t.trim())
            .filter(Boolean) ?? [],
        isVisible: isVisible,
        duration: formData.get("duration") as string,
        imageSrc: formData.get("image") as string,
        githubLink: formData.get("git") as string,
      };

      if (project) {
        const updatedProject = await updateProject(project.id, payload);
        onSaved(updatedProject);
      } else {
        const newProject = await createProject(payload);
        onSaved(newProject);
      }
    });
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-9999 p-4">
      <div className="relative w-full max-w-2xl bg-[#141414] border border-neutral-800 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-md transition"
          aria-label={text.close}
        >
          <X size={18} />
        </button>

        <form
          data-cy="edit-project-form"
          action={handleSubmit}
          className="flex flex-col gap-4 px-6 py-6"
        >
          <h2 className="text-xl font-semibold text-white pr-8">
            {project ? text.editTitle : text.createTitle}
          </h2>

          <div className="flex flex-col gap-1">
            <label htmlFor="project-title" className="text-sm text-neutral-400">
              {text.title}
            </label>
            <input
              id="project-title"
              type="text"
              required
              name="title"
              defaultValue={project?.title ?? ""}
              className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="project-description" className="text-sm text-neutral-400">
              {text.description}
            </label>
            <textarea
              id="project-description"
              name="description"
              defaultValue={project?.description ?? ""}
              className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-blue-500 min-h-80"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="project-tags" className="text-sm text-neutral-400">
              {text.tags}
            </label>
            <input
              id="project-tags"
              type="text"
              name="tags"
              defaultValue={(project?.tags ?? []).join(", ")}
              className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="project-duration" className="text-sm text-neutral-400">
              {text.duration}
            </label>
            <input
              id="project-duration"
              type="text"
              name="duration"
              defaultValue={project?.duration ?? ""}
              className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="project-image" className="text-sm text-neutral-400">
                {text.imageUrl}
              </label>
              <input
                id="project-image"
                type="text"
                name="image"
                value={imagePreview}
                onChange={(e) => {
                  setImagePreview(e.target.value);
                  setImageError(false);
                }}
                className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {imagePreview && (
              <div className="border border-neutral-700 rounded-lg overflow-hidden bg-neutral-900 min-h-32">
                {imageError ? (
                  <div className="h-32 flex items-center justify-center text-sm text-neutral-500">
                    {text.imageFailed}
                  </div>
                ) : (
                  <Image
                    src={projectImage.formPreview(imagePreview)}
                    alt={text.imageAlt}
                    width={600}
                    height={300}
                    className="w-full h-32 object-cover"
                    onError={() => setImageError(true)}
                  />
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="project-git" className="text-sm text-neutral-400">
              {text.githubLink}
            </label>
            <input
              id="project-git"
              type="text"
              name="git"
              defaultValue={project?.githubLink ?? ""}
              className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="project-visibility" className="text-sm text-neutral-400">
              {text.visibility}
            </label>

            <label
              htmlFor="project-visibility"
              data-cy="form-visibility-toggle"
              className="inline-flex items-center gap-3 cursor-pointer"
            >
              <input
                id="project-visibility"
                data-cy="form-visibility-checkbox"
                type="checkbox"
                name="isVisible"
                checked={isVisible}
                onChange={(e) => setIsVisible(e.target.checked)}
                className="sr-only peer"
              />

              <div className="relative w-11 h-6 bg-neutral-900 border border-neutral-700 rounded-full transition-colors peer-checked:bg-green-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-transform peer-checked:after:translate-x-5" />

              <span data-cy="form-visibility-status" className="text-sm text-neutral-400">
                {isVisible ? text.visibleOnPortfolio : text.hiddenOnPortfolio}
              </span>
            </label>
          </div>

          <button
            data-cy="save-project"
            type="submit"
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md text-white text-sm font-medium transition disabled:opacity-50 mt-2"
          >
            {isPending ? text.saving : text.save}
          </button>
        </form>
      </div>
    </div>
  );
}
