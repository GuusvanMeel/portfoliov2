"use client"
import { Project } from '@/app/Features/Projects/types';
import React, { useState } from 'react'
import { toggleVisibility } from '../../admin/page';
import EditProjectForm from './editprojectform';
import { deleteProject } from '@/app/Features/Projects/actions';

export default function AdminProject({ project, OnCloseCreate, OnCreated  }: { project: Project | null; OnCloseCreate?: () => void; OnCreated?: (project: Project) => void; }) {
  const isCreating = project === null;
  
  // Initialize with project data or empty defaults
  const [localProject, setLocalProject] = useState<Project| null>(project);
  const [isopen, setOpen] = useState<boolean>(isCreating); // Auto-open if creating
  const [isDeleted, setIsDeleted] = useState(false);
  
  async function handleToggle() {
    if (!localProject) return;
    const nextIsVisible = !localProject.isVisible;

  try {
    await toggleVisibility(localProject.id, nextIsVisible);

    setLocalProject({
      ...localProject,
      isVisible: nextIsVisible,
    });
  } catch (error) {
    console.error("Failed to update visibility:", error);
    alert("Could not update project visibility.");
  }
}
  
  async function handleDelete() {
    if (!localProject) return;

  const sure = window.confirm("Are you sure you want to delete this project?");
  if (!sure) return;
     try {
    await deleteProject(localProject.id);
    setIsDeleted(true);
  } catch (error) {
    console.error("Failed to delete project:", error);
    alert("Could not delete project. Please try again.");
  }
  }
  
  // If deleted or creating mode without data yet, don't show the card
  if (isDeleted) return null;
  if (isCreating && !localProject) {
    return (
      <div className="w-full">
        <EditProjectForm 
          project={null}
          Onsaved={(created) => {
            setOpen(false);
            
            OnCreated?.(created);
            OnCloseCreate?.();
            
          }
          
        }
        Onclose={() => {
          setOpen(false);
          OnCloseCreate?.();      
        }}     
        />
      </div>
    );
  }
  
  if (!localProject) return null;
  
  return (
    <div className="w-full bg-[#1a1a1a] border border-neutral-800 rounded-lg px-6 py-4 flex justify-between items-start">
      {/* LEFT SIDE */}
      <div className="flex flex-col gap-1 w-[70%]">
        <h2 className="text-lg font-semibold text-white">{localProject.title}</h2>
        <p className="text-neutral-400 text-sm truncate">{localProject.description}</p>
        <div className="text-neutral-500 text-xs flex gap-3 mt-1">
          {localProject.tags && localProject.tags.length > 0 && (
            <span>
              Tags:{" "}
              <span className="text-neutral-400">
                {localProject.tags.join(", ")}
              </span>
            </span>
          )}
        </div>
      </div>
      
      {/* RIGHT SIDE BUTTONS */}
      <div className="flex items-center gap-2">
        <button 
          onClick={handleToggle}
          className='px-3 py-1.5 text-sm bg-neutral-900 border border-neutral-700 rounded-md hover:bg-neutral-800'
        >
          {localProject.isVisible ? "Hide" : "Show"}
        </button>
        
        <button
          onClick={() => setOpen(true)}
          className="px-3 py-1.5 text-sm bg-neutral-900 border border-neutral-700 rounded-md hover:bg-neutral-800"
        >
          Edit
        </button>
        
        <button
          onClick={handleDelete}
          className="px-3 py-1.5 text-sm border border-red-700 text-red-500 rounded-md hover:bg-red-900 hover:text-red-300"
        >
          Delete
        </button>
      </div>
      
      {isopen && (
        <EditProjectForm 
          project={localProject}
          Onsaved={(updated) => {
            setLocalProject(updated);
            setOpen(false);
          }}
          Onclose={() => setOpen(false)}   
        />
      )}
    </div>
  );
}