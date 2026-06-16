import { createServer } from "@/lib/supabase/server";

export default async function TestPage() {
  const supabase = await createServer();

  const { data: projects, error } = await supabase.from("projects").select("*");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>

      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error.message}</p>
        </div>
      ) : (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p>✓ Connection successful!</p>
          <p>Projects in database: {projects?.length || 0}</p>
        </div>
      )}
    </div>
  );
}
