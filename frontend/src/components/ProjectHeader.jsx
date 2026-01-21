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
    <div className='flex justify-between items-center mb-6'>
        <h1 className='font-semibold text-2xl  lg:text-3xl'>Project Dashboard</h1>
        <button className='bg-green-500 py-2 px-4 text-white hover:bg-green-700 transition duration-300 hover:cursor-pointer rounded-lg text-sm lg:text-base' onClick={handleCreateProject}>
            + New Project
        </button>
    </div>
  )
}
