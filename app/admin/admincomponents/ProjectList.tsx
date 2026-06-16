"use client";
import { Project } from "@/app/Features/Projects/types";
import AdminProject from "./AdminProject";
import React, { useEffect, useState } from "react";
import CreateProjectButton from "./CreateProjectButton";
import { List, LayoutGrid } from "lucide-react";

type View = "list" | "grid";

export default function ProjectList({ projects }: { projects: Project[] }) {
  const [items, setItems] = useState(projects);
  const [view, setView] = useState<View>("list");

  // Restore preferred view
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("admin:view") : null;
    if (saved === "list" || saved === "grid") setView(saved);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("admin:view", view);
  }, [view]);

  function handleCreated(newProject: Project) {
    setItems((prev) => [newProject, ...prev]);
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex rounded-md border border-neutral-800 bg-neutral-900/60 p-1">
          <button
            onClick={() => setView("list")}
            aria-pressed={view === "list"}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded transition ${
              view === "list"
                ? "bg-neutral-800 text-white"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <List size={16} />
            List
          </button>
          <button
            onClick={() => setView("grid")}
            aria-pressed={view === "grid"}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded transition ${
              view === "grid"
                ? "bg-neutral-800 text-white"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <LayoutGrid size={16} />
            Grid
          </button>
        </div>

        <CreateProjectButton OnCreated={handleCreated} />
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div className="border border-dashed border-neutral-800 rounded-lg py-16 text-center text-neutral-500">
          No projects yet. Create your first one.
        </div>
      )}

      {/* List view */}
      {view === "list" && items.length > 0 && (
        <div className="flex flex-col gap-3">
          {items.map((project) => (
            <AdminProject key={project.id} project={project} view="list" />
          ))}
        </div>
      )}

      {/* Grid view */}
      {view === "grid" && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((project) => (
            <AdminProject key={project.id} project={project} view="grid" />
          ))}
        </div>
      )}
    </div>
  );
}
