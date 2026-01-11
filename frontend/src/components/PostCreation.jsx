import React, { useState } from 'react'
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { Image, Loader, XIcon } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';


export default function PostCreation() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [type, setType] = useState("Engage");

  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(["authUser"]);


  const { mutate: createPost, isPending: isUploading } = useMutation({
    mutationFn: async (postData) => {
      const res = await axiosInstance.post("/posts/create", postData);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries("posts");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    }
  });

  const handlePostCreation = async () => {
    if (!content.trim() && !image) {
      toast.error("Post should have some material");
      return;
    }
    const postData = { content, image, type };
    createPost(postData);
    setContent("");
    setImage("");
  };

  const handleTypeChange = (type) => {
    setType(type);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => { setImage(reader.result) }; //changing image to base64
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImage("");
  };

  return (
    <div className='bg-slate-50 rounded-lg shadow mb-4 p-4'>
      <div className='flex space-x-3'>
        <img src={authUser.profilePic || "./avatar.png"} alt={authUser.username} className='h-12 w-12 rounded-full' />
        <textarea className="textarea h-28 flex-1 p-4" placeholder="What's on your mind?" onChange={(e) => setContent(e.target.value)} value={content}></textarea>
      </div>
      {image && //if selected image exists
        <div className='mt-3 relative'>
          <button className='absolute top-4 right-4 bg-slate-700 text-white rounded-full p-1 cursor-pointer' onClick={clearImage}><XIcon className='h-8 w-8' /></button>
          <img src={image} alt="selected" className='w-full h-auto rounded-lg' />
        </div>
      }
      <div className='flex justify-between mt-4'>
        <div className='flex gap-3 items-center'>
          <label className='flex gap-2 hover:cursor-pointer hover:bg-green-500 hover:text-white transition-colors rounded-lg p-2'>
            <Image />
            <span className='font-semibold'>Photo</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
          <div className="tabs tabs-box bg-base-200 rounded-xl">
            <button
              type="button"
              className={`tab rounded-lg transition-all ${type === "Engage" ? "tab-active bg-green-500 text-white" : ""
                }`}
              onClick={() => handleTypeChange("Engage")}
            >
              Engage
            </button>

            <button
              type="button"
              className={`tab rounded-lg transition-all ${type === "Help" ? "tab-active bg-green-500 text-white" : ""
                }`}
              onClick={() => handleTypeChange("Help")}
            >
              Help
            </button>
          </div>

        </div>
        <button className="btn text-green-500 border border-green-400 hover:border-none hover:bg-green-500 hover:text-white transition-colors" onClick={handlePostCreation} disabled={isUploading}>
          {isUploading ? <Loader className='animate-spin' /> : "Post"}
        </button>
      </div>
    </div>
  )
}
