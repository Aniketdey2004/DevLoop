import React from 'react'
import toast from 'react-hot-toast';
import { useState } from 'react';
import { X } from 'lucide-react';

export default function SkillSection({userData,isOwnProfile, onSave}) {
  const [isEditing,setIsEditing]=useState(false);
  const [skills, setSkills]=useState(userData.skills||[]);
  const [newSkill, setNewSkill]=useState("");

  const handleAddSkill=()=>{
    if(newSkill && !skills.includes(newSkill)){
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }else{
      toast.error("Provide a valid value");
    }
  };

  const handleDeleteSkill=(skill)=>{
    setSkills(skills.filter((s)=>s!==skill));
  };

  const handleSave=()=>{
    onSave({skills});
    setIsEditing(false);
  }
  return (  
    <div className='mb-6 px-4'>
      <h2 className='text-2xl font-semibold mb-4'>Skills</h2>
      <div className='flex flex-wrap gap-2'>
          {skills.length>0?(
            skills.map((skill,index)=>(
                <span key={index} className='bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm border border-green-200 flex items-center gap-1'>
                  {skill}
                  {isEditing && (
                    <button onClick={()=>handleDeleteSkill(skill)} className='text-red-500 hover:cursor-pointer'>
                        <X size={14}/>
                    </button>
                  )}
                </span>
              ))
            
          ):(<p>No skills added yet</p>)}
      </div>
      {isEditing && (
        <div className='mt-4 flex'>
          <input type='text' placeholder='New Skill' value={newSkill} onChange={(e)=>setNewSkill(e.target.value)} className='flex-grow p-2 border rounded-1'/>
          <button className='bg-green-500 text-white py-2 px-4 rounded-r hover:bg-green-700 hover:cursor-pointer transition duration-300'  onClick={handleAddSkill}>Add Skill</button>
        </div>
      )}
      {isOwnProfile && (
        isEditing ? (
          <button
            onClick={handleSave}
            className='mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 transition hover:cursor-pointer'
          >
            Save Changes
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className='mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 transition hover:cursor-pointer'
          >
            Edit Skills
          </button>
        )
      )}
    </div>
  )
}
