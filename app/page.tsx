import Desktop from "@/components/Desktop/Desktop";
import { getVisibleProjects } from "@/app/Features/Projects/actions";
import { messages } from "@/content/en";

const intro = messages.site.intro;

export default async function Home() {
  const projects = await getVisibleProjects();

  return (
    <main className="h-screen overflow-hidden bg-teal-700">
      <section className="sr-only" aria-labelledby="portfolio-title">
        <h1 id="portfolio-title">{intro.heading}</h1>

        <p>{intro.summary}</p>

        <p>{intro.navigation}</p>
      </section>

      <Desktop projects={projects} />
    </main>
  );
}
