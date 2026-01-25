import React from 'react'
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
export default function ProjectHeader({setOpen}) {
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(["authUser"]);
  const handleCreateProject=()=>{
    if(!authUser.github){
      toast.error("Link your github account for project creation");
      return;
    }
    setOpen(true);
  }
  return (
    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
      <div>
        <h1 className='text-xl sm:text-2xl font-bold text-slate-800'>Project Dashboard</h1>
        <p className='text-sm text-slate-500 mt-1'>Manage your projects and collaboration requests</p>
      </div>
      <button className='bg-green-500 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-green-600 transition shadow-sm w-full sm:w-auto cursor-pointer ' onClick={handleCreateProject}>
        + New Project
      </button>
    </div>
  )
}
