import { getAllProjects, updateProjectVisibility} from "../Features/Projects/actions";
import ProjectList from "./admincomponents/ProjectList";
import Link from "next/link";

export async function toggleVisibility(id: number, hidden: boolean) {
  await updateProjectVisibility(id, hidden)
}

export default async function admin() {

  const projects = await getAllProjects();
return (
  <div className=" w-full max-w-3xl mx-auto mt-10 flex flex-col gap-6">
    <Link
      href="/"
      className="absolute top-0 right-0 px-3 py-1.5 text-sm bg-neutral-900 
                 border border-neutral-700 rounded-md hover:bg-neutral-800 
                 text-white"
    >
      Back
    </Link>
    
    <h1 className="font-bold text-2xl">Admin – Projects</h1>

    <ProjectList projects={projects} ></ProjectList>
  </div>
);
}





