import React, { useState } from 'react'

export default function AboutSection({ userData, isOwnProfile, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [about, setAbout] = useState(userData.about);

  const handleSave = () => {
    onSave({ about });
    setIsEditing(false);
  };

  return (
    <div className='mb-6 px-4'>
      <h2 className='text-2xl font-semibold mb-4'>About</h2>
      {isOwnProfile? (
        isEditing ? (<>
          <textarea value={about} onChange={(e) => setAbout(e.target.value)} className='w-full border rounded' rows='10'/>
          <button className='mt-4 bg-green-500 text-white py-2 px-4 rounded-full transition hover:bg-green-700 cursor-pointer' onClick={handleSave}>Save</button>
        </>) : (
          <>
            <p className='text-gray-600 md:text-lg'>{userData.about || "User has not described himself"}</p>
            <button className='mt-4 bg-green-500 text-white py-2 px-4 rounded-full transition hover:bg-green-700 cursor-pointer' onClick={()=>setIsEditing(true)}>Edit</button>
          </>
        )
      ) : (<p className='text-gray-600 md:text-lg'>{userData.about || "User has not described himself" }</p>)}
    </div>
  )
}
