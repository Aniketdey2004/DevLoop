import Sidebar from './Sidebar';
import PostCreation from './PostCreation';
import RecommendedUser from './RecommendedUser';
import { axiosInstance } from '../lib/axios';
import { User } from 'lucide-react';
import Post from "./Post";
import { useQuery } from '@tanstack/react-query';

export default function Feed() {
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

  return (
    <div className='h-full w-full max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 p-4'>
      <div className='hidden lg:block lg:col-span-1'>
        <Sidebar />
      </div>
      <div className="col-span-1 lg:col-span-2 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto pr-2 hide-scrollbar">
          <PostCreation />
          {posts?.map((post) => (
            <Post key={post._id} post={post} />
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
              recommendedUsers.length>0?(recommendedUsers.map((user) => (<RecommendedUser user={user} key={user._id} />))):<p>No users to follow</p>
            }
          </div>
        </div>
      )}

    </div>
  )
}
