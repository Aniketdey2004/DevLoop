import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { useParams } from 'react-router'
import { axiosInstance } from '../lib/axios';
import Post from '../components/Post';
import Sidebar from "../components/Sidebar";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

export default function PostPage() {
    const { postId } = useParams();
    const queryClient = useQueryClient();
    const authUser = queryClient.getQueryData(["authUser"]);
    const { data: post, isLoading } = useQuery({
        queryKey: ["posts", postId],
        queryFn: async () => {
            const res = await axiosInstance.get(`/posts/${postId}`);
            return res.data;
        }
    });
    
    const navigate = useNavigate();
    const deletePostMutation = useMutation({
        mutationFn: async (pId) => {
            const res = await axiosInstance.delete(`/posts/${pId}`);
            return res.data;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            navigate('/');
        },
        onError: (error) => {
            toast.error(error.response.data.message);
        }
    });

    const createCommentMutation = useMutation({
        mutationFn: async (content) => {
            const res = await axiosInstance.post(`/posts/${post._id}/comment`, { content });
            return res.data;
        },
        onMutate: async (content) => {
            await queryClient.cancelQueries(["posts", postId]);
            const previousPost = queryClient.getQueryData(["posts", postId]);

            const optimisticComment = {
                _id: Date.now(),
                content: content,
                user: {
                    _id: authUser._id,
                    profilePic: authUser.profilePic,
                    username: authUser.username,
                    headline: authUser.headline
                },
                createdAt: new Date().toISOString()
            };

            queryClient.setQueryData(["posts", postId], (oldPost) => (
                { ...oldPost, comments: [...oldPost.comments, optimisticComment] }
            ));

            return { previousPost };
        },
        onSuccess: (data) => {
            toast.success(data.message);
        },
        onError: (error, newComment, context) => {
            queryClient.setQueryData(["posts", postId], context.previousPost);
            toast.error(error.response.data.message);
        }
    });


    const likePostMutation = useMutation({
        mutationFn: async (pId) => {
            const res = await axiosInstance.post(`/posts/${pId}/like`);
            return res.data;
        },
        onMutate: async (postId) => {
            await queryClient.cancelQueries(["posts", postId]);
            const previousPost = queryClient.getQueryData(["posts", postId]);

            queryClient.setQueryData(["posts", postId], (oldPost) => ({ ...oldPost, likes: oldPost.likes.includes(authUser._id) ? oldPost.likes.filter(id => id !== authUser._id) : [...oldPost.likes, authUser._id] }));

            return { previousPost };
        },
        onSuccess: (data) => {
            toast.success(data.message);
        },
        onError: (error, postId, context) => {
            toast.error(error.response.data.message);
            queryClient.setQueryData(["posts", postId], context.previousPost);
        }
    });

    if (isLoading)
        return <p>Loading Post wait... </p>;

    if (!post) {
        return <p>Kya rai jahil</p>;
    }

    return (
        <div className='h-full w-full max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 p-2 lg:p-4'>
            <div className='hidden lg:block lg:col-span-1'>
                <Sidebar />
            </div>
            <div className="col-span-1 lg:col-span-3 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto pr-2 hide-scrollbar">
                    <Post post={post} authUser={authUser} onLike={() => likePostMutation.mutate(postId)}
                        onDelete={() => deletePostMutation.mutate(postId)}
                        onComment={(content) =>
                            createCommentMutation.mutate(content)
                        }
                        likeMutation={likePostMutation}
                        deleteMutation={deletePostMutation}
                        commentMutation={createCommentMutation} />
                </div>
            </div>
        </div>
    )
}
