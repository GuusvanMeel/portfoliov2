import { getAllProjects, updateProjectVisibility } from "../Features/Projects/actions";
import ProjectList from "./admincomponents/ProjectList";
import Link from "next/link";
import { FolderGit2, ArrowLeft } from "lucide-react";

const MAIN_GITHUB_URL = "https://github.com/MyName";

export async function toggleVisibility(id: number, hidden: boolean) {
  await updateProjectVisibility(id, hidden);
}

export default async function admin() {
  const projects = await getAllProjects();

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Top bar */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">Dashboard</span>
          <h1 className="text-2xl font-bold text-white">Admin – Projects</h1>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={"https://github.com/GuusvanMeel"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-neutral-900 border border-neutral-700 rounded-md hover:bg-neutral-800 text-white transition"
          >
            <FolderGit2 size={16} />
            My GitHub
          </a>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-neutral-900 border border-neutral-700 rounded-md hover:bg-neutral-800 text-white transition"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
        </div>
      </header>

      <ProjectList projects={projects} />
    </div>
  );
}
