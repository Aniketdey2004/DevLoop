import React from 'react'
import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { X } from 'lucide-react';

export default function ProjectEdit({project, setIsEditing}) {
    const [newStack, setNewStack] = useState("");
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
                    <input type='text' placeholder='Github Repository link' className='input input-bordered w-full' value={editedProject.githubRepo} onChange={(e) => setEditedProject((prev) => ({ ...prev, githubRepo: e.target.value }))} required />
                    <input type='text' placeholder='Live Url (optional)' className='input input-bordered w-full' value={editedProject.liveUrl} onChange={(e) => setEditedProject((prev) => ({ ...prev, liveUrl: e.target.value }))} />
                    <div className='space-y-2 mb-4'>
                        <p className='font-medium'>Project Status</p>
                        <div className='flex gap-6'>
                            <label className='flex items-center gap-2 cursor-pointer'>
                                <input type='radio' name='status' value='active' checked={editedProject.status === 'active'}
                                    onChange={(e) => {
                                        setEditedProject((prev) => ({ ...prev, status: e.target.value, requireCollaborators: false }));
                                    }}
                                    className='radio radio-success' />
                                Active
                            </label>
                            <label className='flex items-center gap-2 cursor-pointer'>
                                <input type='radio' name='status' value='completed' checked={editProject.status === 'completed'}
                                    onChange={(e) => {
                                        setEditedProject((prev) => ({ ...prev, status: e.target.value, requireCollaborators: false }));
                                    }}
                                    className='radio radio-success' />
                                Completed
                            </label>
                        </div>
                    </div>
                    {editedProject.status !== 'completed' &&
                        <div className='flex ietms-center gap-3'>
                            <input type='checkbox' className='checkbox checkbox-success' checked={editedProject.requireCollaborators} onChange={(e) => setEditedProject((prev) => ({ ...prev, requireCollaborators: e.target.checked }))} />
                            Require Collaborators
                        </div>}
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
