import Sidebar from './Sidebar';
import PostCreation from './PostCreation';
import RecommendedUser from './RecommendedUser';
import { axiosInstance } from '../lib/axios';
import { User } from 'lucide-react';
import Post from "./Post";
import { useQuery } from '@tanstack/react-query';



export default function Feed() {
  const {data:recommendedUsers}=useQuery({
    queryKey:["recommendedUsers"],
    queryFn:async()=>{
      const res=await axiosInstance.get("/users/suggestions");
      return res.data;
    }
  });

  const {data:posts}=useQuery({
    queryKey:["posts"],
    queryFn:async()=>{
      const res=await axiosInstance.get("/posts/feed");
      return res.data;
    }
  });

  return (
    <div className='min-h-full w-full max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6'>
        <div className='hidden lg:block lg:grid-cols-1'>
            <Sidebar/>
        </div>
        <div className='col-span-1 lg:col-span-2'> 
          <PostCreation/>
          {posts?.map((post)=><Post key={post._id} post={post}/>)}
          {posts?.length===0 && 
            <div className='bg-white rounded-lg text-center shadow p-4'>
                <div className='mb-6'>
                  <User size={64} className='mx-auto text-slate-500'/>
                </div>
                <h2 className='text-2xl font-bold mb-4 text-gray-800'>No Posts yet</h2>
                <p className='text-gray-600 mb-6'>Follow others to start seeing their post</p>
            </div>
          }
        </div>
        {recommendedUsers?.length>0 && (
          <div className='hidden lg:block lg:grid-cols-1'>
              <div className='bg-slate-50 p-4 rounded-lg shadow'>
                  <h2 className='font-semibold text-lg mb-3'>Developers you can follow</h2>
                  {
                    recommendedUsers.map((user)=>(<RecommendedUser user={user} key={user._id}/>))
                  }
              </div>
          </div>
        )}
        
    </div>
  )
}
