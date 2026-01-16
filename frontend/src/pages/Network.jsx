import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'
import Sidebar from '../components/Sidebar'
import { Link } from 'react-router'
import { UserRoundSearch, Search, Loader, XIcon } from 'lucide-react';
import { useState } from "react";

export default function Network() {
  const [search, setSearch] = useState("");
  const [searched, setSearched] = useState(false);

  const queryClient = useQueryClient();
  const { data: recommendedUsers } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/suggestions?limitUsers=10");
      return res.data;
    }
  });

  const { data: searchedUsers, refetch: searchUsers, isLoading } = useQuery({
    queryKey: ["searchedUsers", search],
    queryFn: async () => {
      const res = await axiosInstance.get(`/users/search/${search}`);
      return res.data;
    },
    enabled: false
  });

  const { data: followers } = useQuery({
    queryKey: ["followers"],
    queryFn: async () => {
      const res = await axiosInstance.get('/users/followers');
      return res.data;
    }
  })

  const { data: following } = useQuery({
    queryKey: ["following"],
    queryFn: async () => {
      const res = await axiosInstance.get('/users/following');
      return res.data;
    }
  })

  const { mutate: followUser } = useMutation({
    mutationFn: async (id) => {
      const res = await axiosInstance.post(`/users/${id}/follow`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries("following");
      queryClient.invalidateQueries("recommendedUsers");
    },
    onError: (error) => toast.error(error.response.data.message),
  });

  const { mutate: unfollowUser } = useMutation({
    mutationFn: async (id) => {
      const res = await axiosInstance.post(`/users/${id}/unfollow`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries("following");
      queryClient.invalidateQueries("recommendedUsers");
    },
    onError: (error) => toast.error(error.response.data.message),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search.trim()) {
      toast.error("Provide username");
      return;
    }
    setSearched(true);
    searchUsers();
  }

  const cancelSearch = () => {
    setSearch("");
    setSearched(false);
    queryClient.removeQueries({ queryKey: ["searchedUsers"] });
  }


  return (
    <div className="h-full w-full max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 p-4">
      <div className="hidden lg:block lg:col-span-1">
        <Sidebar />
      </div>

      <div className="col-span-1 lg:col-span-3 h-full flex flex-col">
        <div className="bg-slate-50 h-full rounded-lg shadow p-3 flex flex-col">
          <div className="tabs tabs-lift">

            <label className="tab">
              <input type="radio" name="my_tabs_4" defaultChecked />
              Followers
            </label>

            <div className="tab-content bg-base-100 border-base-300 p-2 md:p-6">
              {followers ? (followers.length > 0 ? (
                <ul className="space-y-3 h-[75vh] overflow-y-auto hide-scrollbar">
                  {followers?.map((follower) => (
                    <li
                      key={follower._id}
                      className="border border-slate-400 p-4 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      <Link className="flex items-center gap-2 md:gap-4" to={`/profile/${follower._id}`}>
                        <img
                          src={follower.profilePic || './avatar.png'}
                          className="size-12 rounded-full"
                        />
                        <div>
                          <h2 className="font-medium text-sm md:text-base lg:text-lg">{follower.username}</h2>
                          <p className="text-slate-600 text-xs md:text-sm lg:text-base">{follower.headline}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : <p>No followers. Increase your engagement</p>) : <p>Loading followers...</p>}
            </div>

            <label className="tab">
              <input type="radio" name="my_tabs_4" />
              Following
            </label>
            <div className="tab-content bg-base-100 border-base-300 p-2 md:p-6">
              {following ? (following.length > 0 ? (
                <ul className="space-y-3 h-[75vh] overflow-y-auto hide-scrollbar">
                  {following?.map((followedUser) => (
                    <li
                      key={followedUser._id}
                      className="border border-slate-400 p-4 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      <Link className="flex items-center gap-2 md:gap-4" to={`/profile/${followedUser._id}`}>
                        <img
                          src={followedUser.profilePic || './avatar.png'}
                          className="size-12 rounded-full shrink-0"
                        />
                        <div className='flex-1'>
                          <h2 className="font-medium text-sm md:text-base lg:text-lg">{followedUser.username}</h2>
                          <p className="text-slate-600 text-xs md:text-sm lg:text-base">{followedUser.headline}</p>
                        </div>
                        <button className="btn btn-outline btn-error rounded-2xl shrink-0" onClick={() => unfollowUser(followedUser._id)}>Unfollow</button>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : <p>Follow users and expand your network</p>) : <p>Loading followed users</p>}
            </div>

            <label className="tab">
              <input type="radio" name="my_tabs_4" />
              <UserRoundSearch className='size-4 mr-2' />
              Search
            </label>
            <div className="tab-content bg-base-100 border-base-300 p-2 md:p-6">
              <form className='flex items-center gap-2 flex-wrap mb-4' onSubmit={handleSubmit}>
                <input type='text' placeholder='Search Developer' className='border border-gray-500 px-4 py-2 md:px-8 md:py-3 rounded-2xl flex-1 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-none' value={search} onChange={(e) => setSearch(e.target.value)} />
                {searched && <button type='button' className="p-2 md:p-3 rounded-lg bg-gray-500 text-white hover:bg-gray-700 hover:cursor-pointer text-sm md:text-base transition-colors" onClick={cancelSearch}><XIcon /></button>}
                {!searched && <button className="p-2 md:p-3 rounded-lg bg-green-500 text-white hover:bg-green-700 transition-colors hover:cursor-pointer text-sm md:text-base" disabled={isLoading}>
                  {isLoading ? <Loader className='animate-spin' /> : <Search />}
                </button>}
              </form>
              {
                !searched ? (
                  recommendedUsers ? (
                    recommendedUsers.length > 0 ? (
                      <ul className="space-y-3 h-[75vh] overflow-y-auto hide-scrollbar">
                        {recommendedUsers?.map((user) => (
                          <li
                            key={user._id}
                            className="border border-slate-400 p-4 rounded-lg hover:bg-slate-200 transition-colors"
                          >

                            <Link className="flex items-center gap-2 md:gap-4"  to={`/profile/${user._id}`}>
                              <img
                                src={user.profilePic || './avatar.png'}
                                className="size-12 rounded-full shrink-0"
                              />
                              <div className='flex-1'>
                                <h2 className="font-medium text-sm md:text-base lg:text-lg">{user.username}</h2>
                                <p className="text-slate-600 text-xs md:text-sm lg:text-base">{user.headline}</p>
                              </div>
                              <button className="btn btn-outline btn-success rounded-2xl shrink-0" onClick={() => followUser(user._id)}>Follow</button>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : <p>No More Developers to follow</p>
                  ) : <p>Loading recommeded Users...</p>
                ) : (
                  isLoading ? <p>Loading searched Users</p> : (
                    searchedUsers.length > 0 ? (
                      <ul className="space-y-3 h-[75vh] overflow-y-auto hide-scrollbar">
                        {searchedUsers?.map((user) => (
                          <li
                            key={user._id}
                            className="border border-slate-400 p-4 rounded-lg hover:bg-slate-200 transition-colors"
                          >
                            <Link className="flex items-center gap-2 md:gap-4"  to={`/profile/${user._id}`}>
                              <img
                                src={user.profilePic || './avatar.png'}
                                className="size-12 rounded-full shrink-0"
                              />
                              <div className='flex-1'>
                                <h2 className="font-medium text-sm md:text-base lg:text-lg">{user.username}</h2>
                                <p className="text-slate-600 text-xs md:text-sm lg:text-base">{user.headline}</p>
                              </div>
                              {following?.some(f => f._id === user._id) ? (
                                <button
                                  className="btn btn-outline btn-error rounded-2xl shrink-0"
                                  onClick={() => unfollowUser(user._id)}
                                >
                                  Unfollow
                                </button>
                              ) : (
                                <button
                                  className="btn btn-outline btn-success rounded-2xl shrink-0"
                                  onClick={() => followUser(user._id)}
                                >
                                  Follow
                                </button>
                              )}

                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : <p>No developer exist with this username</p>
                  )
                )
              }
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
