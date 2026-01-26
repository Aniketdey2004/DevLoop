import { useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { Link, useParams } from "react-router";
import { axiosInstance } from "../lib/axios.js";
import { ExternalLink, Loader, User } from 'lucide-react';
import DiscussionPanel from '../components/DiscussionPanel.jsx';
export default function ProjectPage() {
    const { projectId } = useParams();
    const queryClient = useQueryClient();
    const authUser = queryClient.getQueryData(["authUser"]);
    const { data: project, isLoading: isLoadingProjects } = useQuery({
        queryKey: ["project", projectId],
        queryFn: async () => {
            const res = await axiosInstance.get(`/projects/${projectId}`);
            return res.data;
        }
    });
    if (isLoadingProjects) {
        return (
            <div className='flex justify-center items-center h-full'>
                <Loader className='animate-spin' />
            </div>
        )
    }

    const isCollaborator = project.collaborators.some((collab) => collab._id === authUser._id);


    return (
        <div className='h-full overflow-y-auto w-full  hide-scrollbar bg-slate-50 px-8 py-8'>
            <div className='mb-6'>
                <h1 className='text-2xl font-bold text-green-500'>{project.title}</h1>
                <p className='text-slate-500 mt-1 max-w-3xl'>{project.description}</p>
            </div>
            <div className='bg-white rounded-xl border border-slate-300 shadow-sm p-5 mb-6'>
                <div className='mb-4'>
                    <span className='badge badge-success badge-outline'>{project.type}</span>
                </div>

                {project.techStack.length > 0 ? (
                    <div className='mb-4'>
                        <h4 className='text-lg text-slate-600 font-semibold  mb-2'>Tech Stack</h4>
                        <div className='flex flex-wrap gap-4 text-sm'>
                            {project.techStack.map((stack, index) => (
                                <span className='badge badge-outline' key={index}>{stack}</span>
                            ))}
                        </div>
                    </div>
                ) : null}
                <div className='mb-4'>
                    <Link className='flex items-center gap-4' to={`/profile/${project.ownerId._id}`}>
                        <img src={project.ownerId.profilePic || '/avatar.png'} alt='owner image' className='size-12 rounded-full object-cover border border-slate-300 ' />
                        <div>
                            <p className='text-sm text-slate-500'>Project Owner</p>
                            <p className='text-base font-semibold text-slate-800'>
                                @{project.ownerId.username}
                            </p>
                        </div>
                    </Link>
                </div>
                <div className='flex items-center gap-4 mb-4'>
                    {(isCollaborator || project.type === 'portfolio') && <a href={project.githubRepo.repoUrl} className='btn btn-sm btn-outline btn-success flex items-center gap-2'>Github Repo <ExternalLink size={14} /></a>}
                    {project.liveUrl && <a href={project.liveUrl} className='btn btn-sm btn-ghost'>Live Demo</a>}
                </div>
                {project.type === 'collaboration' && (
                    <div className='mb-4'>
                        <h3 className='font-semibold text-slate-700 mb-2'>
                            Roles Needed
                        </h3>
                        <div className='flex flex-wrap gap-2'>
                            {project.rolesNeeded.map((role, index) => (
                                <span className='badge badge-outline' key={index}>{role}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {project.type === 'collaboration' && (
                <div className='tabs tabs-bordered'>
                    <input type='radio' name='project_tabs' role='tab' className='tab text-base' aria-label='Collaborators' />
                    <div role='tab-panel' className='tab-content pt-6'>
                        <div className='bg-white rounded-xl border border-slate-200 p-5'>
                            <h2 className='text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2'>
                                <User size={18} />
                                Collaborators
                            </h2>
                            <div className='space-y-4'>
                                {project.collaborators.map((collaborator) => (
                                    <div className='flex items-center gap-3' key={collaborator._id}>
                                        <Link to={`/profile/${collaborator._id}`}><img src={collaborator.profilePic || '/avatar.png'} className='size-10 rounded-full object-cover' /></Link>
                                        <div>
                                            <p className='font-medium text-slate-700 text-sm md:text-base'>{collaborator.username}</p>
                                            <p className='
                                        text-sm text-slate-500 line-clamp-1'>{collaborator.headline}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {isCollaborator &&
                        <>
                            <input type='radio' name='project_tabs' role='tab' className='tab text-base' aria-label='Discussion' />
                            <div role='tabpanel' className='tab-content pt-6'>
                                <DiscussionPanel />
                            </div>
                        </>
                    }
                </div>
            )}
        </div>
    )
}
