import React from 'react'
import { Link } from 'react-router'
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, Loader } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
export default function CollabRqCard({ rq }) {
    const queryClient=useQueryClient();

    const {mutate:acceptRequest, isLoading:isAcceptingRequest}=useMutation({
        mutationFn:async()=>{
            const res=await axiosInstance.patch(`/collab/accept/${rq._id}`);
            return res.data;
        },
        onSuccess:(data)=>{
            toast.success(data.message);
            queryClient.invalidateQueries({queryKey:["collabRequests"]});
        },
        onError:(error)=>{
            toast.error(error.response.data.message);
        }
    });

    const {mutate:rejectRequest, isLoading:isRejectingRequest}=useMutation({
        mutationFn:async()=>{
            const res=await axiosInstance.patch(`/collab/reject/${rq._id}`);
            return res.data;
        },
        onSuccess:(data)=>{
            toast.success(data.message);
            queryClient.invalidateQueries({queryKey:["collabRequests"]});
        },
        onError:(error)=>{
            toast.error(error.response.data.message);
        }
    });

    return (
        <div className='flex items-start gap-3 border rounded-lg p-3 flex-wrap'>
            <Link to={`/profile/${rq.sender._id}`}>
                <img src={rq.sender.profilePic || '/avatar.png'} alt='sender image' className='size-10 rounded-full shrink-0' />
            </Link>
            <div className='flex-1'>
                <p className='lg:text-lg'><span className='font-semibold'>{rq.sender.username}</span> sent you a collab request</p>
                <p className='text-sm lg:text-base text-slate-500'>{rq.sender.headline}</p>
                <p className='text-xs text-slate-600 mb-2'>
                    {formatDistanceToNow(new Date(rq.createdAt), { addSuffix: true })}
                </p>
                <Link to={ `/project/${rq.project._id}`} className='flex items-center p-2 bg-gray-50 w-48 space-x-2 hover:bg-gray-100 transition-colors'>
                    <div className='flex-1 overflow-hidden'>
                        <p className='font-medium truncate'>{rq.project.title}</p>
                    </div>
                    <ExternalLink size={14} className='text-gray-400' />
                </Link>
            </div>
            <div className='flex gap-2 shrink-0'>
                <button className='btn btn-success btn-xs lg:btn-md' disabled={isAcceptingRequest || isRejectingRequest} onClick={acceptRequest}>{isAcceptingRequest?<Loader className='animate-spin'/>:"Accept"}</button>
                <button className='btn btn-outline btn-error btn-xs lg:btn-md' disabled={isAcceptingRequest || isRejectingRequest} onClick={rejectRequest}>
                    {isRejectingRequest?<Loader className='animate-spin'/>:"Reject"}
                </button>
            </div>
        </div>
    )
}
