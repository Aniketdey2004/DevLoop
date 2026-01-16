import Sidebar from './Sidebar';
import PostCreation from './PostCreation';
import RecommendedUser from './RecommendedUser';
import { axiosInstance } from '../lib/axios';
import { User } from 'lucide-react';
import Post from "./Post";
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export default function Feed() {
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(["authUser"]);

  const { data: recommendedUsers } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/suggestions?limitUsers=5");
      return res.data;
    }
  });

  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/posts/feed");
      return res.data;
    }
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId) => {
      const res = await axiosInstance.delete(`/posts/${postId}`);
      return res.data;
    },
    onSuccess: (data,postId) => {
      toast.success(data.message);
      queryClient.invalidateQueries("posts");
      queryClient.invalidateQueries({queryKey:["posts",postId]});
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    }
  });

  const createCommentMutation = useMutation({
    mutationFn: async ({ postId, content }) => {
      const res = await axiosInstance.post(`/posts/${postId}/comment`, { content });
      return res.data;
    },
    onMutate: async ({ postId, content }) => {
      await queryClient.cancelQueries(["posts"]);
      const previousPosts = queryClient.getQueryData(["posts"]);

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

      queryClient.setQueryData(["posts"], (oldQueryData) => (
        oldQueryData.map((oldPost) => oldPost._id === postId ? { ...oldPost, comments: [...oldPost.comments, optimisticComment] } : oldPost)
      ));

      return { previousPosts };
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error, newComment, context) => {
      queryClient.setQueryData(["posts"], context.previousPosts);
      toast.error(error.response.data.message);
    }
  });


  const likePostMutation = useMutation({
    mutationFn: async (postId) => {
      const res = await axiosInstance.post(`/posts/${postId}/like`);
      return res.data;
    },
    onMutate: async (postId) => {
      await queryClient.cancelQueries(["posts"]);
      const previousPosts = queryClient.getQueryData(["posts"]);

      queryClient.setQueryData(["posts"], (oldPosts) =>
        oldPosts.map((post) =>
          post._id === postId
            ? {
              ...post,
              likes: post.likes.includes(authUser._id)
                ? post.likes.filter(id => id !== authUser._id)
                : [...post.likes, authUser._id],
            }
            : post
        )
      );

      return { previousPosts }
    },
    onSuccess: (data,postId) => {
      toast.success(data.message);
      queryClient.invalidateQueries({queryKey:["posts",postId]});
    },
    onError: (error, postId, context) => {
      toast.error(error.response.data.message);
      queryClient.setQueryData(["posts"], context.previousPosts);
    }
  });

  return (
    <div className='h-full w-full max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 p-4'>
      <div className='hidden lg:block lg:col-span-1'>
        <Sidebar />
      </div>
      <div className="col-span-1 lg:col-span-2 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto pr-2 hide-scrollbar">
          <PostCreation />
          {posts?.map((post) => (
            <Post key={post._id} post={post} authUser={authUser} onLike={() => likePostMutation.mutate(post._id)}
              onDelete={() => deletePostMutation.mutate(post._id)}
              onComment={(content) =>
                createCommentMutation.mutate({ postId: post._id, content })
              }
              likeMutation={likePostMutation}
              deleteMutation={deletePostMutation}
              commentMutation={createCommentMutation} />
          ))}

          {posts?.length === 0 && (
            <div className="bg-white rounded-lg text-center shadow p-4">
              <User size={64} className="mx-auto text-slate-500" />
              <h2 className="text-2xl font-bold mt-4 text-gray-800">
                No Posts yet
              </h2>
              <p className="text-gray-600 mt-2">
                Follow others to start seeing their posts
              </p>
            </div>
          )}
        </div>
      </div>
      {recommendedUsers && (
        <div className='hidden lg:block lg:col-span-1'>
          <div className='bg-slate-50 p-4 rounded-lg shadow'>
            <h2 className='font-semibold text-lg mb-3'>Developers you can follow</h2>
            {
              recommendedUsers.length > 0 ? (recommendedUsers.map((user) => (<RecommendedUser user={user} key={user._id} />))) : <p>No users to follow</p>
            }
          </div>
        </div>
      )}

    </div>
  )
}
