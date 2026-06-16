"use client"
import { Project } from '@/app/Features/Projects/types';
import AdminProject from './AdminProject'
import React, { useState } from 'react'
import CreateProjectButton from './CreateProjectButton';



export default function ProjectList({projects}: {projects: Project[]}) {
  const [items, setItems] = useState(projects);

  function handleCreated(newProject: Project) {
  setItems(prev => [newProject, ...prev]);

}
    return (
    <div>
         <div className="flex justify-end mb-4">
      <CreateProjectButton OnCreated={handleCreated} />
    </div>
        {items.map((project) => (
          <AdminProject key={project.id} project={project} />

        ))}</div>
  )
}
