// app/admin/admincomponents/ProjectList.tsx
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
    <div className="flex flex-col gap-8">
      
      <div className="flex items-center justify-between gap-4">
        <div className="inline-flex rounded-md border border-neutral-800 bg-neutral-900/60 p-1.5">
          <button
            onClick={() => setView("list")}
            aria-pressed={view === "list"}
            className={`inline-flex items-center gap-3 px-5 py-3 text-base rounded transition ${
              view === "list" ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-white"
            }`}
          >
            <List size={20} />
            List
          </button>
          <button
            onClick={() => setView("grid")}
            aria-pressed={view === "grid"}
            className={`inline-flex items-center gap-3 px-5 py-3 text-base rounded transition ${
              view === "grid" ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-white"
            }`}
          >
            <LayoutGrid size={20} />
            Grid
          </button>
        </div>

        <CreateProjectButton onCreated={handleCreated} />
      </div>

      {items.length === 0 && (
        <div className="border border-dashed border-neutral-800 rounded-lg py-24 text-center text-lg text-neutral-500">
          No projects yet. Create your first one.
        </div>
      )}

      {view === "list" && items.length > 0 && (
        <div className="flex flex-col gap-5">
          {items.map((project) => (
            <AdminProject key={project.id} project={project} view="list" />
          ))}
        </div>
      )}

      {view === "grid" && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((project) => (
            <AdminProject key={project.id} project={project} view="grid" />
          ))}
        </div>
      )}
    </div>
  );
}
