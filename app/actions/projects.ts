"use server";

import { createServer } from "@/lib/supabase/server";
import { projectType } from "@/public/types/projectType";

export async function GetMainProjects(){
  const supabase = await createServer();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_hidden", false)
    .order("created_at", { ascending: false });

   if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  return projects;
  }
  export async function GetAllProjects(){
  const supabase = await createServer();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

   if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  return projects;
  }

  export async function updateProjectHidden(id: number, isHidden: boolean) {
  const supabase = await createServer();
const {error} = await supabase
    .from("projects")
    .update({is_hidden: isHidden})
    .eq("id", id)
    if (error) {
    console.error("Error updating project is_hidden:", error);
    throw new Error(`failed to update ishidden ${error.message}`)
  }
}
export async function UpdateProject(id: number,projectdata:projectType) {
    const title = projectdata.title
    const description = projectdata.description
    const tags = projectdata.tags
    const updated_at = projectdata.updated_at
    const duration = projectdata.duration
    const imagesrc = projectdata.imagesrc
    const Github_Link = projectdata.Github_Link
    
    
    const supabase = await createServer();
    const {error} = await supabase
    .from("projects")
    .update({
        title,
        description,
        tags,
        updated_at,
        duration,
        imagesrc,
        Github_Link
    })
    .eq("id", id)

     if (error) {
    console.error("Update error:", error);
    throw new Error(`Failed to update project: ${error.message}`);
  }
}
export async function CreateProject(data: Partial<projectType>) {

  const supabase = await createServer();
  const { data: created, error } = await supabase
    .from("projects")
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return created;
}
export async function DeleteProject(id: number){
  const supabase = await createServer();
  const {error} = await supabase
    .from("projects")
    .delete()
    .eq("id", id)
    
    if (error) {
    console.error("Delete error:", error);
    throw new Error(`Failed to delete project: ${error.message}`);
    }
    return true;
}

