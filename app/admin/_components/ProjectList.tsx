"use client";
import { LayoutGrid, List } from "lucide-react";
import { useState } from "react";
import CreateProjectButton from "@/app/admin/_components/CreateProjectButton";
import ProjectListItem from "@/app/admin/_components/ProjectListItem";
import { messages } from "@/content/en";
import type { Project } from "@/features/projects/types";
import { viewModeCookie, type ViewMode } from "@/features/admin/viewMode";
import { writePreferenceCookie } from "@/lib/preferenceCookie";

const text = messages.admin.list;

export default function ProjectList({
  projects,
  initialView,
}: Readonly<{ projects: Project[]; initialView: ViewMode }>) {
  const [items, setItems] = useState(projects);
  const [view, setView] = useState<ViewMode>(initialView);

  function chooseView(newView: ViewMode) {
    setView(newView);
    writePreferenceCookie(viewModeCookie, newView);
  }

  function handleCreated(newProject: Project) {
    setItems((prev) => [newProject, ...prev]);
  }

  return (
    <div data-cy="admin-projects" data-view={view} className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <div className="inline-flex rounded-md border border-neutral-800 bg-neutral-900/60 p-1.5">
          <button
            data-cy="view-option"
            data-view-option="list"
            onClick={() => chooseView("list")}
            aria-pressed={view === "list"}
            className={`inline-flex items-center gap-3 px-5 py-3 text-base rounded transition ${
              view === "list" ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-white"
            }`}
          >
            <List size={20} />
            {text.listView}
          </button>
          <button
            data-cy="view-option"
            data-view-option="grid"
            onClick={() => chooseView("grid")}
            aria-pressed={view === "grid"}
            className={`inline-flex items-center gap-3 px-5 py-3 text-base rounded transition ${
              view === "grid" ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-white"
            }`}
          >
            <LayoutGrid size={20} />
            {text.gridView}
          </button>
        </div>

        <CreateProjectButton onCreated={handleCreated} />
      </div>

      {items.length === 0 && (
        <div className="border border-dashed border-neutral-800 rounded-lg py-24 text-center text-lg text-neutral-500">
          {text.empty}
        </div>
      )}

      {view === "list" && items.length > 0 && (
        <div className="flex flex-col gap-5">
          {items.map((project) => (
            <ProjectListItem key={project.id} project={project} view="list" />
          ))}
        </div>
      )}

      {view === "grid" && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((project) => (
            <ProjectListItem key={project.id} project={project} view="grid" />
          ))}
        </div>
      )}
    </div>
  );
}
