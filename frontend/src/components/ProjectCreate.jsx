import React from 'react'
import { useState } from 'react';
import { X } from "lucide-react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';
import toast from "react-hot-toast";

export default function ProjectCreate({ setOpen }) {
    const [newStack, setNewStack] = useState("");
    const [newRole, setNewRole] = useState("");
    const [newProject, setNewProject] = useState({
        title: "",
        description: "",
        type: "portfolio",
        techStack: [],
        githubRepo: "",
        liveUrl: "",
        rolesNeeded: [],
    });

    const queryClient = useQueryClient();

    const { mutate: createProject } = useMutation({
        mutationFn: async () => {
            const res = await axiosInstance.post('/project/create', newProject);
            return res.data;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
        onError: (err) => {
            console.log(err);
            toast.error(err.response.data.message);
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        createProject();
        setOpen(false);
    };

    return (
        <div className='modal modal-open'>
            <div className='modal-box relative'>
                <button className='btn btn-sm btn-circle absolute right-3 top-3' onClick={() => setOpen(false)}>
                    <X size={16} />
                </button>
                <h3 className='font-semibold text-lg mb-4'>Create new project</h3>
                <form className='space-y-3' onSubmit={handleSubmit}>
                    <input type='text' placeholder='Project title' required className='input input-bordered w-full' value={newProject.title} onChange={(e) => setNewProject((prev) => ({ ...prev, title: e.target.value }))} />
                    <textarea placeholder='Description' required className='textarea textarea-bordered w-full' value={newProject.description} onChange={(e) => setNewProject((prev) => ({ ...prev, description: e.target.value }))} />
                    <div className='flex flex-wrap gap-2'>
                        {newProject.techStack.map((stack, index) => (<span key={index} className='bg-green-500 text-white px-3 py-1 rounded-full text-sm mb-2 flex items-center gap-1'>
                            {stack}
                            <button type='button' onClick={() => setNewProject((prev) => ({ ...prev, techStack: prev.techStack.filter((_, i) => i !== index) }))}><X size={14} /></button>
                        </span>))}
                    </div>
                    <div className='flex gap-2'>
                        <input type='text' placeholder='Add tech (React, Node, MongoDB...)' className='input input-bordered flex-1' value={newStack} onChange={(e) => setNewStack(e.target.value)} />
                        <button type='button' className='btn btn-success' onClick={() => {
                            if (!newStack.trim()) return;
                            // prevent duplicates
                            if (newProject.techStack.includes(newStack)) return;
                            setNewProject((prev) => ({ ...prev, techStack: [...prev.techStack, newStack] }));
                            setNewStack("");
                        }}>Add</button>
                    </div>
                    <input type='text' placeholder='Github Repository link' className='input input-bordered w-full' value={newProject.githubRepo} onChange={(e) => setNewProject((prev) => ({ ...prev, githubRepo: e.target.value }))} required />
                    <input type='text' placeholder='Live Url (optional)' className='input input-bordered w-full' value={newProject.liveUrl} onChange={(e) => setNewProject((prev) => ({ ...prev, liveUrl: e.target.value }))} />
                    <div className='space-y-2 mb-4'>
                        <p className='font-medium'>Project Type</p>
                        <div className='flex gap-6'>
                            <label className='flex items-center gap-2 cursor-pointer'>
                                <input type='radio' name='type' value='portfolio' checked={newProject.type === 'portfolio'}
                                    onChange={(e) => {
                                        setNewProject((prev) => ({ ...prev, type: e.target.value }));
                                    }}
                                    className='radio radio-success' />
                                Portfolio
                            </label>
                            <label className='flex items-center gap-2 cursor-pointer'>
                                <input type='radio' name='type' value='collaboration' checked={newProject.type === 'collaboration'}
                                    onChange={(e) => {
                                        setNewProject((prev) => ({ ...prev, type: e.target.value }));
                                    }}
                                    className='radio radio-success' />
                                Collaboration
                            </label>
                        </div>
                    </div>
                    {newProject.type !== 'portfolio' &&
                        <div>
                            <div className='flex flex-wrap gap-2'>
                                {newProject.rolesNeeded.map((role, index) => (<span key={index} className='bg-green-500 text-white px-3 py-1 rounded-full text-sm mb-2 flex items-center gap-1'>
                                    {role}
                                    <button type='button' onClick={() => setNewProject((prev) => ({ ...prev, rolesNeeded: prev.rolesNeeded.filter((_, i) => i !== index) }))}><X size={14} /></button>
                                </span>))}
                            </div>
                            <div className='flex gap-2'>
                                <input type='text' placeholder='Add required Roles (Frontend, Backend, Cloud Engineer)' className='input input-bordered flex-1' value={newRole} onChange={(e) => setNewRole(e.target.value)} />
                                <button type='button' className='btn btn-success' onClick={() => {
                                    if (!newRole.trim()) return;
                                    // prevent duplicates
                                    if (newProject.rolesNeeded.includes(newRole)) return;
                                    setNewProject((prev) => ({ ...prev, rolesNeeded: [...prev.rolesNeeded, newRole] }));
                                    setNewRole("");
                                }}>Add</button>
                            </div>
                        </div>
                    }
                    <div className='modal-action'>
                        <button type='submit' className='btn btn-success'>Create</button>
                        <button className='btn' type='button' onClick={() => setOpen(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
