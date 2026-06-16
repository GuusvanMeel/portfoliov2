// app/admin/components/CreateProjectButton.tsx (Client Component)
"use client"

import { useState } from "react";
import AdminProject from "./AdminProject";
import { Project } from "@/app/Features/Projects/types";

export default function CreateProjectButton({
  OnCreated,
}: {
  OnCreated: (project: Project) => void;
}) {  const [showCreate, setShowCreate] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowCreate(true)}
        className="px-4 py-2  bg-blue-600 hover:bg-blue-500 rounded-md text-white transition"
      >
        + Create New Project
      </button>

      {showCreate && (
        <AdminProject project={null}
        OnCreated={OnCreated}
        OnCloseCreate={() => setShowCreate(false)}    />
      )}
    </>
  );
}