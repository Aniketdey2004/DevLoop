import React from 'react'
import ProjectHeader from '../components/ProjectHeader';
import ProjectCreate from '../components/ProjectCreate';
import ProjectCard from '../components/ProjectCard';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';
import { useState } from 'react';

export default function Project() {
  const [open, setOpen] = useState(false);

  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await axiosInstance.get("/project");
      return res.data;
    }
  });

  return (
    <div className="h-full overflow-y-auto max-w-8xl mx-auto p-4 lg:p-6 space-y-6 hide-scrollbar">
      <ProjectHeader setOpen={setOpen} />

      <div className="card bg-base-100 border">
        <div className="card-body max-h-[70vh] overflow-y-auto space-y-3 p-0">
          {/* Sticky header */}
          <div className="sticky top-0 z-10 bg-base-100 px-6 py-4 rounded-t-lg">
            <h2 className="text-2xl font-semibold">
              Your Projects
            </h2>
          </div>

          {/* Scrollable content */}
          <div className="px-6 pb-4 space-y-4">
            {!isLoadingProjects ? (projects.length > 0 ? (projects.map((project) => (<ProjectCard key={project._id} project={project} />))) : (<p className='text-slate-500'>You haven’t created any projects yet.</p>)) : (<p>Loading your projects...</p>)}
          </div>

        </div>
      </div>

      <div className="card bg-base-100 border">
        <div className="card-body max-h-[50vh] overflow-y-auto space-y-4">
          <h2 className="sticky top-0 z-10 bg-base-100 pb-2 text-2xl font-semibold">
            Collaboration Requests
          </h2>

          <p className="text-slate-500">
            No collaboration requests yet.
          </p>
        </div>
      </div>

      {open && <ProjectCreate setOpen={setOpen} />}
    </div>
  );
}

