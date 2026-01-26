import React from 'react'
import { Link } from 'react-router'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function RecommendedUser({ user }) {
    const queryClient = useQueryClient();

    const { mutate: followUser } = useMutation({
        mutationFn: async () => {
            const res = await axiosInstance.post(`/users/${user._id}/follow`);
            return res.data;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries("recommendedUsers");
        },
        onError: (error) => {
            toast.error(error.response.data.message);
        }
    });

    return (
        <div className='mb-4 flex items-center justify-between gap-1'>
            <Link to={`/profile/${user._id}`} className='flex items-center'>
                <img src={user.profilePic || "./avatar.png"} alt={user.username} className='h-12 w-12 rounded-full mr-2 object-cover' />
                <h3 className='font-semibold  truncate'>{user.username}</h3>
            </Link>
            <button
                className="btn btn-outline btn-success rounded-2xl shrink-0 hover:bg-green-500 text-green-500 border-green-500 hover:text-white transition-colors"
                onClick={() => followUser(user._id)}
            >
                Follow
            </button>
        </div>
    )
}
