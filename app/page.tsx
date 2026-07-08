
import Desktop from "./components/Desktop/Desktop";
import FpsCounter from "./Features/Debug/FpsCounter";
import { getVisibleProjects } from "./Features/Projects/actions";



export default async function Home() {
  const projects = await getVisibleProjects(); 


  return (
    <main className="h-screen overflow-hidden bg-teal-700">
      
        <FpsCounter></FpsCounter>

        <Desktop projects={projects}  />
      
    </main>
  );
}