import React from 'react'
import ProjectHeader from '../components/ProjectHeader';
import ProjectCreate from '../components/ProjectCreate';
import ProjectCard from '../components/ProjectCard';
import CollabRqCard from '../components/CollabRqCard';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';
import { useState } from 'react';

export default function Project() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(["authUser"]);

  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res=await axiosInstance.get("/projects");
      return res.data;
    }
  });

  const { data: collabRequests = [], isLoading: isLoadingCollabRq } = useQuery({
    queryKey: ["collabRequests"],
    queryFn: async () => {
      const res=await axiosInstance.get("/collab/requests");
      return res.data;
    }
  });

  return (
    <div className="h-full overflow-y-auto w-full bg-slate-50 px-6 py-6 hide-scrollbar">
      <div className="max-w-7xl mx-auto space-y-8">
        {!authUser.github && (
          <div className="alert alert-error shadow-sm">
            <span>
              Link your GitHub account to create or collaborate on projects.
            </span>
          </div>
        )}
        <ProjectHeader setOpen={setOpen} />
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-slate-800">
              My Projects
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Projects you own or collaborate on
            </p>
          </div>

          <div className="p-6">
            {isLoadingProjects ? (
              <p className="text-slate-500">Loading projects…</p>
            ) : projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map(project => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>
            ) : (
              <p className="text-slate-500">
                You haven’t created any projects yet.
              </p>
            )}
          </div>
        </section>


        <section className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-slate-800">
              Collaboration Requests
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Requests from developers who want to collaborate
            </p>
          </div>

          <div className="p-6 space-y-4 max-h-96 overflow-y-auto hide-scrollbar">
            {isLoadingCollabRq ? (
              <p className="text-slate-500">Loading requests…</p>
            ) : collabRequests.length > 0 ? (
              collabRequests.map(rq => (
                <CollabRqCard key={rq._id} rq={rq} />
              ))
            ) : (
              <p className="text-slate-500">
                No collaboration requests yet.
              </p>
            )}
          </div>
        </section>

        {open && <ProjectCreate setOpen={setOpen} />}
      </div>
    </div>
  );
}
