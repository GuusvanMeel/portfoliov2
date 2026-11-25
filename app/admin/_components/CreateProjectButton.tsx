"use client";

import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import ProjectFormDialog from "@/app/admin/_components/ProjectFormDialog";
import { messages } from "@/content/en";
import type { Project } from "@/features/projects/types";
import { useEscapeKey } from "@/hooks/useEscapeKey";

export default function CreateProjectButton({
  onCreated,
}: Readonly<{
  onCreated?: (project: Project) => void;
}>) {
  const [isOpen, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);
  useEscapeKey(close);

  return (
    <>
      <button
        data-cy="create-project"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-3 px-6 py-3 text-base bg-white text-black font-medium rounded-lg hover:bg-neutral-200 transition"
      >
        <Plus size={22} />
        {messages.admin.list.create}
      </button>

      {isOpen && (
        <div className="w-full">
          <ProjectFormDialog
            project={null}
            onSaved={(created) => {
              onCreated?.(created);
              close();
            }}
            onClose={close}
          />
        </div>
      )}
    </>
  );
}
