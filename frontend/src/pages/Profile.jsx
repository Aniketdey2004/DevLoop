import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { useParams } from 'react-router'
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';
import ProfileHeader from '../components/ProfileHeader';
import AboutSection from '../components/AboutSection';
import EducationSection from "../components/EducationSection";
import ExperienceSection from '../components/ExperienceSection';
import SkillsSection from "../components/SkillSection.jsx";
import GithubComp from '../components/GithubComp.jsx';

export default function Profile() {
  const { userId } = useParams();
  const queryClient = useQueryClient();

  const authUser = queryClient.getQueryData(["authUser"]);

  const { data: userData, isLoading } = useQuery({
    queryKey: ["users", userId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/users/${userId}`);
      return res.data;
    }
  });

  const { mutate: updateProfile } = useMutation({
    mutationFn: async (updatedData) => {
      const res = await axiosInstance.patch("/users/update", updatedData);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["users", userId] });
      queryClient.invalidateQueries({queryKey:["authUser"]});
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    }
  });

  if (isLoading)
    return (
      <div className='flex justify-center items-center h-full'>
        <Loader className='animate-spin' />
      </div>
    )

  const isOwnProfile = userData._id === authUser._id;
  const isFollowing=userData.followers.includes(authUser._id);
  const handleSave = (updatedData) => {
    updateProfile(updatedData);
  };

  return (
      <div className='mx-auto max-w-4xl  bg-slate-50  lg:rounded-t-md lg:my-2 h-[91vh] overflow-y-auto hide-scrollbar h-full'>
        <ProfileHeader userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} isFollowing={isFollowing} />
        <GithubComp userData={userData} isOwnProfile={isOwnProfile} />
        <AboutSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
        <ExperienceSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
        <EducationSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
        <SkillsSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
        {/* create a profile project section only list the project and */}
      </div>
  )
}
