// app/admin/page.tsx
import { getAllProjects, updateProjectVisibility } from "../Features/Projects/actions";
import ProjectList from "./admincomponents/ProjectList";
import Link from "next/link";
import { FolderGit2, ArrowLeft } from "lucide-react";

const MAIN_GITHUB_URL = "https://github.com/MyName";

export async function toggleVisibility(id: number, hidden: boolean) {
  await updateProjectVisibility(id, hidden);
}

export default async function AdminPage() {
  const projects = await getAllProjects();

  return (
    <div className="w-full flex flex-col gap-10">
      <header className="flex flex-wrap items-center justify-between gap-6 border-b border-neutral-800 pb-8">
        <div className="flex flex-col gap-2">
          <span className="text-sm uppercase tracking-[0.2em] text-neutral-500">Dashboard</span>
          <h1 className="text-4xl font-bold text-white">Admin – Projects</h1>
        </div>

        <div className="flex items-center gap-4">
          <a
            href={MAIN_GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-5 py-3 text-base bg-neutral-900 border border-neutral-700 rounded-md hover:bg-neutral-800 text-white transition"
          >
            <FolderGit2 size={20} />
            My GitHub
          </a>

          <Link
            href="/"
            className="inline-flex items-center gap-3 px-5 py-3 text-base bg-neutral-900 border border-neutral-700 rounded-md hover:bg-neutral-800 text-white transition"
          >
            <ArrowLeft size={20} />
            Back
          </Link>
        </div>
      </header>

      <ProjectList projects={projects} />
    </div>
  );
}
