"use client";

import { Project, ProjectInputData } from "@/app/Features/Projects/types";
import { useState, useTransition } from "react";
import { createProject, updateProject } from "@/app/Features/Projects/actions"

export default function EditProjectForm({ project, Onsaved, Onclose }: { project: Project | null, Onsaved: (updated: Project) => void; Onclose: () => void; }) {
  const [isPending, startTransition] = useTransition();
  const [isVisible, setIsVisible] = useState(project?.isVisible ?? true);

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      // Build a project object from form
      const payload: ProjectInputData = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        tags: (formData.get("tags") as string)
          ?.split(",")
          .map(t => t.trim())
          .filter(Boolean) ?? [],
        isVisible: isVisible,
        duration: formData.get("duration") as string,
        imageSrc: formData.get("image") as string,
        githubLink: formData.get("git") as string,


      };

      // 🔹 If editing → update
      if (project) {
        const updatedProject = await updateProject(project.id, payload);
        Onsaved(updatedProject);
      }

      // 🔹 If creating → create new project
      else {
        const newProject = await createProject(payload);
        Onsaved(newProject);   // return full created row to parent

      }
    });
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-9999 animate-fadeIn"
      onClick={Onclose}            // 👈 background click closes
    >
      <div
        className="relative w-full max-w-lg bg-[#1a1a1a] border border-neutral-700 rounded-xl shadow-xl p-6 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}   // 👈 modal blocks background close
      >

        {/* Close button - now anchored to THIS modal */}
        <button
          onClick={Onclose}
          className="absolute top-3 right-3 text-neutral-400 hover:text-white text-xl"
        >
          ×
        </button>
        <form
          action={handleSubmit}
          className="w-full bg-[#1a1a1a] border border-neutral-800 rounded-lg px-6 py-6 flex flex-col gap-4"

        >
          <h2 className="text-xl font-semibold text-white">  {project ? "Edit Project" : "Create Project"}</h2>

          {/* Title */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-neutral-400">Title</label>
            <input
              type="text"
              required
              name="title"
              defaultValue={project?.title ?? ""}
              className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-white focus:outline-none"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-neutral-400">Description</label>
            <textarea
              name="description"
              defaultValue={project?.description ?? ""}
              className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-white focus:outline-none min-h-25"
            />
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-neutral-400">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              defaultValue={(project?.tags ?? []).join(", ")}
              className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-white focus:outline-none"
            />
          </div>

          {/* Duration */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-neutral-400">Duration</label>
            <input
              type="text"
              name="duration"
              defaultValue={project?.duration ?? ""}
              className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-white"
            />
          </div>

          {/* Image URL */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-neutral-400">Image URL</label>
            <input
              type="text"
              name="image"
              defaultValue={project?.imageSrc ?? ""}
              className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-white"
            />
          </div>

          {/* GitHub Link */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-neutral-400">GitHub Link</label>
            <input
              type="text"
              name="git"
              defaultValue={project?.githubLink ?? ""}
              className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-white"
            />
          </div>
          {/* {Visibility} */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-neutral-400">Visibility</label>

            <label className="inline-flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isVisible"
                checked={isVisible}
                onChange={(e) => setIsVisible(e.target.checked)}
                className="sr-only peer"
              />

              <div className="relative w-11 h-6 bg-neutral-900 border border-neutral-700 rounded-full transition-colors peer-checked:bg-green-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-transform peer-checked:after:translate-x-5" />

              <span className="text-sm text-neutral-400">
                {isVisible ? "Visible on portfolio" : "Hidden on portfolio"}
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md text-white transition disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
