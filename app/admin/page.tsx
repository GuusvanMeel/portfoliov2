import { getAllProjects } from "@/features/projects/actions";
import ProjectList from "@/app/admin/_components/ProjectList";
import Link from "next/link";
import { FolderGit2, ArrowLeft } from "lucide-react";
import { logout } from "@/app/admin/actions";
import { githubUrl } from "@/config/site";
import { messages } from "@/content/en";
import type { Metadata } from "next";

const text = messages.admin.header;

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const projects = await getAllProjects();

  return (
    <div className="w-full flex flex-col gap-10">
      <header className="flex flex-wrap items-center justify-between gap-6 border-b border-neutral-800 pb-8">
        <div className="flex flex-col gap-2">
          <span className="text-sm uppercase tracking-[0.2em] text-neutral-500">
            {text.eyebrow}
          </span>
          <h1 className="text-4xl font-bold text-white">{text.title}</h1>
        </div>

        <div className="flex items-center gap-4">
          <form action={logout}>
            <button
              type="submit"
              className="inline-flex items-center gap-3 px-5 py-3 text-base bg-fuchsia-200 border border-neutral-700 rounded-md hover:bg-neutral-800 text-black transition"
            >
              {text.logout}
            </button>
          </form>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-5 py-3 text-base bg-neutral-900 border border-neutral-700 rounded-md hover:bg-neutral-800 text-white transition"
          >
            <FolderGit2 size={20} />
            {text.github}
          </a>

          <Link
            href="/"
            className="inline-flex items-center gap-3 px-5 py-3 text-base bg-neutral-900 border border-neutral-700 rounded-md hover:bg-neutral-800 text-white transition"
          >
            <ArrowLeft size={20} />
            {text.back}
          </Link>
        </div>
      </header>

      <ProjectList projects={projects} />
    </div>
  );
}
