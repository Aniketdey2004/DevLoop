import React from 'react'
import { Link } from 'react-router'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function RecommendedUser({user}) {
    const queryClient=useQueryClient();

    const {mutate:followUser}=useMutation({
        mutationFn:async()=>{
            const res=await axiosInstance.post(`/users/${user._id}/follow`);
            return res.data;
        },
        onSuccess:(data)=>{
            toast.success(data.message);
            queryClient.invalidateQueries("recommendedUsers");
        },
        onError:(error)=>{
            toast.error(error.response.data.message);
        }
    });

  return (
    <div className='mb-4 flex items-center justify-between'>
        <Link to={`/profile/${user.email}`} className='flex items-center'>
            <img src={user.profilePic || "./avatar.png"} alt={user.username} className='h-12 w-12 rounded-full mr-2'/>
            <h3 className='font-semibold text-lg'>{user.username}</h3>
        </Link>
        <button onClick={followUser} className='px-3 py-1 text-sm font-medium text-green-600 hover:text-white hover:bg-green-700 border rounded-lg border-green-500 transition-colors hover:cursor-pointer'>follow</button>
    </div>
  )
}
