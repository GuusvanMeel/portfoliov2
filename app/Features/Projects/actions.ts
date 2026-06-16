"use server";

import { createServer } from "@/lib/supabase/server";
import { Project, ProjectInputData } from "./types";
import { mapProjectRowToProject, mapUpdateProjectInputToRow } from "./mapper";

export async function getAllProjects(): Promise<Project[]> {
    const supabase = await createServer();

    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching projects:", error);
        return [];
    }

    return data.map(mapProjectRowToProject)
}
export async function getVisibleProjects(): Promise<Project[]> {
    const supabase = await createServer();

    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("is_visible", true)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching projects:", error);
        return [];
    }

    return data.map(mapProjectRowToProject)
}

export async function updateProjectVisibility(id: number, isVisible: boolean) {

    const supabase = await createServer();
    const { error } = await supabase
        .from("projects")
        .update({ is_visible: isVisible })
        .eq("id", id)
    if (error) {
        console.error("Error updating project is_visible:", error);
        throw new Error(`failed to update is_visible ${error.message}`)
    }
}
export async function updateProject(id: number, input: ProjectInputData): Promise<Project> {
    const supabase = await createServer();

    const { data, error } = await supabase
        .from("projects")
        .update(mapUpdateProjectInputToRow(input))
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Update error:", error);
        throw new Error(`Failed to update project: ${error.message}`);
    }
    return mapProjectRowToProject(data); 
}
export async function createProject(input: ProjectInputData): Promise<Project> {

    const supabase = await createServer();
    const { data, error } = await supabase
        .from("projects")
        .insert(mapUpdateProjectInputToRow(input))
        .select()
        .single();

    if (error) {
        console.error("Create error:", error);
        throw new Error(`Failed to create project: ${error.message}`);
    }

    return mapProjectRowToProject(data);
}
export async function deleteProject(id: number) {
    const supabase = await createServer();
    const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", id)

    if (error) {
        console.error("Delete error:", error);
        throw new Error(`Failed to delete project: ${error.message}`);
    }
}

