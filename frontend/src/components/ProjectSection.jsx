import React from 'react'
import { axiosInstance } from '../lib/axios';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, Loader } from 'lucide-react';
import { Link } from 'react-router';
export default function ProjectSection({userData}) {
    const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
        queryKey: ["projects",userData._id],
        queryFn: async () => {
            const res = await axiosInstance.get(`/projects/user/${userData._id}`);
            return res.data;
        }
    });
    return (
        <div className='mb-6 p-5'>
            <h2 className='text-2xl font-semibold text-slate-800 mb-4'>Projects</h2>
            <div className='bg-white70 border border-slate-200 rounded-xl'>
                {isLoadingProjects ? (
                    <div className='flex justify-center py-6 '>
                        <Loader className='animate-spin text-slate-500' />
                    </div>
                ) : projects.length > 0 ? (
                    <ul className='divide-y divide-slate-200'>
                        {projects.map((project) => (
                            <li key={project._id} className='py-4 flex items-start justify-between gap-4 px-4  hover:bg-slate-100 transition'>
                                <div className='min-w-0'>
                                    <p className='font-medium text-slate-800 truncate'>{project.title}</p>
                                    <p className='text-sm text-slate-500 line-clamp-2 mt-1'>
                                        {project.description}
                                    </p>
                                </div>
                                <Link className='flex items-center gap-1 text-sm text-green-600 hover:text-green-700 hover:underline shrink-0' to={`/project/${project._id}`}>
                                View <ExternalLink size={14}/></Link>
                            </li>
                        ))}
                    </ul>
                ) : <p className='text-slate-500 text-sm'>No projects added yet.</p>

                }
            </div>
        </div>
    )
}
