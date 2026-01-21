import React from 'react'
import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { X } from 'lucide-react';

export default function ProjectEdit({ project, setIsEditing }) {

    const [newStack, setNewStack] = useState("");
    const [newRole, setNewRole] = useState("");
    const [editedProject, setEditedProject] = useState(project || {});

    const queryClient = useQueryClient();

    const { mutate: editProject } = useMutation({
        mutationFn: async () => {
            const res = await axiosInstance.patch(`/project/${project._id}`, editedProject);
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
        editProject();
        setIsEditing(false);
    };
    return (
        <div className='modal modal-open'>
            <div className='modal-box relative'>
                <button className='btn btn-sm btn-circle absolute right-3 top-3' onClick={() => setIsEditing(false)}>
                    <X size={16} />
                </button>
                <h3 className='font-semibold text-lg mb-4'>Edit project</h3>
                <form className='space-y-3' onSubmit={handleSubmit}>
                    <input type='text' placeholder='Project title' required className='input input-bordered w-full' value={editedProject.title} onChange={(e) => setEditedProject((prev) => ({ ...prev, title: e.target.value }))} />
                    <textarea placeholder='Description' required className='textarea textarea-bordered w-full' value={editedProject.description} onChange={(e) => setEditedProject((prev) => ({ ...prev, description: e.target.value }))} />
                    <div className='flex flex-wrap gap-2'>
                        {editedProject.techStack.map((stack, index) => (<span key={index} className='bg-green-500 text-white px-3 py-1 rounded-full text-sm mb-2 flex items-center gap-1'>
                            {stack}
                            <button type='button' onClick={() => setEditedProject((prev) => ({ ...prev, techStack: prev.techStack.filter((_, i) => i !== index) }))}><X size={14} /></button>
                        </span>))}
                    </div>
                    <div className='flex gap-2'>
                        <input type='text' placeholder='Add tech (React, Node, MongoDB...)' className='input input-bordered flex-1' value={newStack} onChange={(e) => setNewStack(e.target.value)} />
                        <button type='button' className='btn btn-success' onClick={() => {
                            if (!newStack.trim()) return;
                            // prevent duplicates
                            if (editedProject.techStack.includes(newStack)) return;
                            setEditedProject((prev) => ({ ...prev, techStack: [...prev.techStack, newStack] }));
                            setNewStack("");
                        }}>Add</button>
                    </div>
                    <input type='text' placeholder='Github Repository link' className='input input-bordered w-full' value={editedProject.githubRepo.repoUrl} onChange={(e) => setEditedProject((prev) => ({ ...prev, githubRepo: {...prev.githubRepo,repoUrl:e.target.value} }))} required />
                    <input type='text' placeholder='Live Url (optional)' className='input input-bordered w-full' value={editedProject.liveUrl} onChange={(e) => setEditedProject((prev) => ({ ...prev, liveUrl: e.target.value }))} />
                    {editedProject.type !== 'portfolio' &&
                        <div>
                            <div className='flex flex-wrap gap-2'>
                                {editedProject.rolesNeeded.map((role, index) => (<span key={index} className='bg-green-500 text-white px-3 py-1 rounded-full text-sm mb-2 flex items-center gap-1'>
                                    {role}
                                    <button type='button' onClick={() => setEditedProject((prev) => ({ ...prev, rolesNeeded: prev.rolesNeeded.filter((_, i) => i !== index) }))}><X size={14} /></button>
                                </span>))}
                            </div>
                            <div className='flex gap-2'>
                                <input type='text' placeholder='Add required Roles (Frontend, Backend, Cloud Engineer)' className='input input-bordered flex-1' value={newRole} onChange={(e) => setNewRole(e.target.value)} />
                                <button type='button' className='btn btn-success' onClick={() => {
                                    if (!newRole.trim()) return;
                                    // prevent duplicates
                                    if (editedProject.rolesNeeded.includes(newRole)) return;
                                    setEditedProject((prev) => ({ ...prev, rolesNeeded: [...prev.rolesNeeded, newRole] }));
                                    setNewRole("");
                                }}>Add</button>
                            </div>
                        </div>
                    }
                    <div className='modal-action'>
                        <button type='submit' className='btn btn-success'>Edit</button>
                        <button className='btn' type='button' onClick={() => setIsEditing(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
