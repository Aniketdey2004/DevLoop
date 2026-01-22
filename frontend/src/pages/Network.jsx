import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'
import Sidebar from '../components/Sidebar'
import { Link } from 'react-router'
import { UserRoundSearch, Search, Loader, XIcon } from 'lucide-react';
import { useState } from "react";

export default function Network() {
    const [search, setSearch] = useState("");
    const [searched, setSearched] = useState(false);
    const [selectedTab, setSelectedTab] = useState("followers");

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
            queryClient.invalidateQueries({ queryKey: ["following"] });
            queryClient.invalidateQueries({ queryKey: ["recommendedUsers"] });
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
            queryClient.invalidateQueries({ queryKey: ["following"] });
            queryClient.invalidateQueries({ queryKey: ["recommendedUsers"] });
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
        <div className='h-full w-full max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 p-4'>
            <div className='hidden lg:block lg:col-span-1'>
                <Sidebar />
            </div>
            <div className='col-span-1 lg:col-span-3 overflow-hidden flex flex-col bg-slate-50  rounded-lg shadow p-6 '>
                <ul className="menu menu-horizontal  bg-base-200 rounded-box mb-3">
                    <li><a onClick={() => setSelectedTab("followers")} className={`${selectedTab === 'followers' ? "bg-slate-200/70" : null}`}>Followers</a></li>
                    <li><a onClick={() => setSelectedTab("following")} className={`${selectedTab === 'following' ? "bg-slate-200/70" : null}`}>Following</a></li>
                    <li><a onClick={() => setSelectedTab("search")} className={`${selectedTab === 'search' ? "bg-slate-200/70" : null}`}><UserRoundSearch size={16} /> Search</a></li>
                </ul>
                <div className='overflow-y-auto hide-scrollbar flex-1'>
                    {selectedTab === 'followers' &&
                        <>
                            {followers ? (followers.length > 0 ? (
                                <ul className="h-full overflow-y-auto hide-scrollbar space-y-3">
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
                                                    <p className="text-slate-600 text-xs md:text-sm lg:text-base line-clamp-1">{follower.headline}</p>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}

                                </ul>) : <p>No followers. Increase your engagement</p>) : <p>Loading followers...</p>
                            }
                        </>
                    }
                    {
                        selectedTab === 'following' &&
                        <>
                            {following ? (following.length > 0 ? (<ul className="h-full overflow-y-auto hide-scrollbar space-y-3">
                                {following?.map((followedUser) => (
                                    <li
                                        key={followedUser._id}
                                        className="border border-slate-400 p-4 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2 md:gap-4"
                                    >
                                        <Link to={`/profile/${followedUser._id}`}>
                                            <img
                                                src={followedUser.profilePic || './avatar.png'}
                                                className="size-12 rounded-full shrink-0"
                                            />
                                        </Link>
                                        <div className='flex-1'>
                                            <h2 className="font-medium text-sm md:text-base lg:text-lg">{followedUser.username}</h2>
                                            <p className="text-slate-600 text-xs md:text-sm lg:text-base line-clamp-1">{followedUser.headline}</p>
                                        </div>
                                        <button className="btn btn-outline btn-error rounded-2xl shrink-0" onClick={() => unfollowUser(followedUser._id)}>Unfollow</button>

                                    </li>
                                ))}

                            </ul>) : <p>Follow users and expand your network</p>) : <p>Loading followed users</p>
                            }
                        </>
                    }
                    {
                        selectedTab === 'search' &&
                        <>
                            <form className='flex items-center gap-2 flex-wrap mb-4 p-2' onSubmit={handleSubmit}>
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
                                            <ul className="h-full overflow-y-auto hide-scrollbar space-y-3">
                                                {recommendedUsers?.map((user) => (
                                                    <li
                                                        key={user._id}
                                                        className="border border-slate-400 p-4 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2 md:gap-4"
                                                    >

                                                        <Link  to={`/profile/${user._id}`}>
                                                            <img
                                                                src={user.profilePic || './avatar.png'}
                                                                className="size-12 rounded-full shrink-0"
                                                            />
                                                        </Link>
                                                            <div className='flex-1'>
                                                                <h2 className="font-medium text-sm md:text-base lg:text-lg">{user.username}</h2>
                                                                <p className="text-slate-600 text-xs md:text-sm lg:text-base line-clamp-1">{user.headline}</p>
                                                            </div>
                                                            <button className="btn btn-outline btn-success rounded-2xl shrink-0 hover:bg-green-500 text-green-500 border-green-500 hover:text-white transition-colors" onClick={() => followUser(user._id)}>Follow</button>
                                                        
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : <p>No More Developers to follow</p>
                                    ) : <p>Loading recommeded Users...</p>
                                ) : (
                                    isLoading ? <p>Loading searched Users</p> : (
                                        searchedUsers.length > 0 ? (
                                            <ul className="h-full overflow-y-auto hide-scrollbar space-y-3">
                                                {searchedUsers?.map((user) => (
                                                    <li
                                                        key={user._id}
                                                        className="border border-slate-400 p-4 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2 md:gap-4"
                                                    >
                                                        <Link className="" to={`/profile/${user._id}`}>
                                                            <img
                                                                src={user.profilePic || './avatar.png'}
                                                                className="size-12 rounded-full shrink-0"
                                                            />
                                                        </Link>
                                                            <div className='flex-1'>
                                                                <h2 className="font-medium text-sm md:text-base lg:text-lg">{user.username}</h2>
                                                                <p className="text-slate-600 text-xs md:text-sm lg:text-base line-clamp-1">{user.headline}</p>
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
                                                                    className="btn btn-outline btn-success rounded-2xl shrink-0 hover:bg-green-500 text-green-500 border-green-500 hover:text-white transition-colors"
                                                                    onClick={() => followUser(user._id)}
                                                                >
                                                                    Follow
                                                                </button>
                                                            )}

                                                        
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : <p>No developer exist with this username</p>
                                    )
                                )
                            }
                        </>
                    }
                </div>
            </div>
        </div>
    )
}
