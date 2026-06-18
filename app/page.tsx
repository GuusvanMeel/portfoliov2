
import { getVisibleProjects } from "./Features/Projects/actions";
import WindowManager from "./window/WindowManager";

export default async function Home() {
  const projects = await getVisibleProjects(); 
  return (
    <main className="h-screen overflow-hidden bg-teal-700">
        

        <WindowManager projects={projects}  />
      
    </main>
  );
}