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

  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await axiosInstance.get("/project");
      return res.data;
    }
  });

  const { data: collabRequests, isLoading: isLoadingCollabRq } = useQuery({
    queryKey: ["collabRequests"],
    queryFn: async () => {
      const res = await axiosInstance.get("/collab/requests");
      return res.data;
    }
  });

  return (
    <div className='h-full overflow-y-auto lg:mt-2 w-full max-w-7xl mx-auto hide-scrollbar'>
      <div className="bg-slate-50 space-y-6 p-6 rounded-md">
        {
          !authUser.github && (
            <div role="alert" className="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>You need to link your DevLoop account to Github for Project collaboration and creation</span>
            </div>

          )
        }
        <ProjectHeader setOpen={setOpen} />

        <div className="card bg-base-100 border">
          <div className="card-body max-h-[70vh] overflow-y-auto space-y-3 p-0">
            <div className="sticky top-0 z-10 bg-base-100 px-6 py-4 rounded-t-lg">
              <h2 className="text-lg lg:text-2xl font-semibold">
                Your Projects
              </h2>
            </div>

            <div className="px-6 pb-4 space-y-4">
              {!isLoadingProjects ? (projects.length > 0 ? (projects.map((project) => (<ProjectCard key={project._id} project={project} />))) : (<p className='text-slate-500'>You haven’t created any projects yet.</p>)) : (<p>Loading your projects...</p>)}
            </div>

          </div>
        </div>

        <div className="card bg-base-100 border">
          <div className="card-body max-h-[70vh] overflow-y-auto space-y-3 p-0">
            <div className="sticky top-0 z-10 bg-base-100 px-6 py-4 rounded-t-lg">
              <h2 className="text-lg lg:text-2xl font-semibold">
                Collaboration Requests
              </h2>
            </div>

            <div className="px-6 pb-4 space-y-4">
              {!isLoadingCollabRq ? (collabRequests.length > 0 ? (collabRequests.map((rq) => (<CollabRqCard key={rq._id} rq={rq} />))) : (<p className='text-slate-500'>You don't have any requests yet</p>)) : (<p>Loading your collab requests</p>)}
            </div>

          </div>
        </div>

        {open && <ProjectCreate setOpen={setOpen} />}
      </div>
    </div>
  );
}

