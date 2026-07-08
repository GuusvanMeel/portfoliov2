
import Desktop from "./components/Desktop/Desktop";
import { getVisibleProjects } from "./Features/Projects/actions";



export default async function Home() {
  const projects = await getVisibleProjects(); 


return (
  <main className="h-screen overflow-hidden bg-teal-700">
    <section className="sr-only" aria-labelledby="portfolio-title">
      <h1 id="portfolio-title">
        Guus van Meel - Software Developer Portfolio
      </h1>

      <p>
        Portfolio van Guus van Meel, software developer gespecialiseerd in
        webdevelopment, Next.js, React, TypeScript, JavaScript, C# en backend
        development.
      </p>

      <p>
        Bekijk mijn projecten, ervaring en contactinformatie via de interactieve
        desktop interface.
      </p>
    </section>

    <Desktop projects={projects} />
  </main>
);
}