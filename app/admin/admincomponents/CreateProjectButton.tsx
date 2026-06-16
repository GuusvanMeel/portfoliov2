// app/admin/admincomponents/CreateProjectButton.tsx
"use client";
import { useEffect, useState } from "react";
import AdminProject from "./AdminProject";
import { Plus } from "lucide-react";
import { Project } from "@/app/Features/Projects/types";

export default function CreateProjectButton({
  onCreated,
}:Readonly<{
  onCreated?: (project: Project) => void;
}>) {
  const [isOpen, setOpen] = useState(false);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

     return () => {
       window.removeEventListener("keydown", handleKeyDown);
     };
   }, []);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-3 px-6 py-3 text-base bg-white text-black font-medium rounded-lg hover:bg-neutral-200 transition"
      >
        <Plus size={22} />
        Create New Project
      </button>

      {isOpen && (
        <AdminProject
          project={null}
          OnCreated={onCreated}
          OnCloseCreate={() => setOpen(false)}
        />
      )}
    </>
  );
}
