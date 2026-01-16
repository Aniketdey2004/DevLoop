import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { Camera, MapPin } from 'lucide-react';

export default function ProfileHeader({ userData, isOwnProfile, onSave, isFollowing }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const queryClient = useQueryClient();

  const { mutate: followUser } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/users/${userData._id}/follow`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["users", userData._id] });
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    }
  });

  const { mutate: unfollowUser } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/users/${userData._id}/unfollow`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["users", userData._id] });
    },
    onError: (error) => {
      toast.error(error.reponse.data.message);
    }
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditedData((prev) => (
        { ...prev, [e.target.name]: reader.result }
      ));
    }; //changing image to base64
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onSave(editedData);
    setIsEditing(false);
    setEditedData({});
  };

  return (
    <div className='mb-6'>
      <div style={{ backgroundImage: `url('${editedData.bannerImg || userData.bannerImg || "/banner.png"}')` }} className='h-48 lg:rounded-t-md bg-cover bg-center relative '>
        {isEditing && (
          <label className='absolute top-3 right-3 bg-white rounded-full shadow hover:cursor-pointer p-1'>
            <Camera />
            <input type='file' accept='image/*' className='hidden' name='bannerImg' onChange={handleImageChange} />
          </label>
        )}
      </div>
      <div className='relative -mt-20 mb-4'>
        <img src={editedData.profilePic || userData.profilePic || '/avatar.png'} className='w-32 h-32 rounded-full mx-auto object-cover ' />
        {isEditing && (
          <label className='absolute right-1/2 bottom-0 transform translate-x-16 bg-white p-2 rounded-full shadow cursor-pointer'>
            <Camera />
            <input type='file' accept='image/*' className='hidden' name='profilePic' onChange={handleImageChange} />
          </label>
        )}
      </div>
      <div className='text-center mb-4 px-2'>
        {isEditing ? (
          <input type='text' value={editedData.username ?? userData.username} name='username' onChange={(e) => setEditedData((prev) => ({ ...prev, [e.target.name]: e.target.value }))} className='text-2xl font-bold mb-2 text-center w-full'/>
        ) : (<h1 className='text-2xl font-bold'>{userData.username}</h1>)}
        {isEditing ? (
          <input type='text' value={editedData.headline ?? userData.headline} name='headline' onChange={(e) => setEditedData((prev) => ({ ...prev, [e.target.name]: e.target.value }))} className='text-gray-600 text-center w-full' />
        ) : (<p className='text-xl font-medium text-gray-500'>{userData.headline}</p>)}
        <div className='flex justify-center items-center mt-2'>
          <MapPin className='size-8 text-gray-500 mr-1' />
          {isEditing ? (<input type='text' value={editedData.location ?? userData.location} name='location' onChange={(e) => setEditedData((prev) => ({ ...prev, [e.target.name]: e.target.value }))} className='text-center'/>) : (<p className='text-gray-600'>{userData.location}</p>)}
        </div>
      </div>
      <div className='px-4 flex justify-center'>
        {isOwnProfile ? (isEditing ? (
        <button className='w-full bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-700 transition-colors cursor-pointer' onClick={handleSave}>Save Profile</button>
      ) : (<button className='w-full bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-700 transition-colors cursor-pointer' onClick={() => setIsEditing(true)}>Edit Profile</button>))
        : (isFollowing ? (<button
          className="btn btn-outline btn-error rounded-2xl cursor-pointer"
          onClick={() => unfollowUser(userData._id)}
        >
          Unfollow
        </button>) : (<button
          className="btn btn-outline btn-success rounded-2xl cursor-pointer"
          onClick={() => followUser(userData._id)}
        >
          Follow
        </button>))}
      </div>
    </div>
  )
}
