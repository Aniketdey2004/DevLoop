import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { Briefcase, X } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';
import { v4 as uuidv4 } from 'uuid';

export default function ExperienceSection({ userData, isOwnProfile, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [experiences, setExperiences] = useState(userData.experience || []);
  const [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    startDate: "",
    endDate: "",
    description: "",
    currentlyWorking: false
  });

  const handleAddExperience = () => {
    if (newExperience.title && newExperience.company && newExperience.startDate) {
      setExperiences((prev) => [...prev, { ...newExperience, tempId: uuidv4() }]);
      setNewExperience({
        title: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
        currentlyWorking: false
      });
    } else {
      toast.error("provide all fields");
    }
  };

  const handleDeleteExperience = (id) => {
    setExperiences((prev) =>
      prev.filter(
        (experience) => experience._id !== id && experience.tempId !== id
      )
    );
  };

  const handleSave = () => {
    const cleanedExperiences = experiences.map(
      ({ currentlyWorking, tempId, ...exp }) => ({ ...exp })
    );
    onSave({ experience: cleanedExperiences });
    setIsEditing(false);
  };

  const handleCurrentlyWorkingChange = (e) => {
    setNewExperience((prev) => ({
      ...prev,
      currentlyWorking: e.target.checked,
      endDate: ""
    }));
  };

  return (
    <div className='mb-6 px-4'>
      <h2 className='text-2xl font-semibold mb-4'>Experience</h2>

      {experiences.length > 0 ? (
        experiences.map((exp) => (
          <div key={exp._id || exp.tempId} className='mb-4 flex justify-between'>
            <div className='flex gap-4'>
              <Briefcase size={25} />
              <div>
                <h3 className='font-semibold'>{exp.title}</h3>
                <p className='text-gray-600'>{exp.company}</p>
                <p className='text-gray-500 text-sm'>
                  {formatDate(exp.startDate)} -{" "}
                  {exp.endDate ? formatDate(exp.endDate) : "Present"}
                </p>
                <p className='text-gray-700'>{exp.description}</p>
              </div>
            </div>

            {isEditing && (
              <button
                className='text-red-500 hover:text-red-700 transition-colors shrink-0'
                onClick={() => handleDeleteExperience(exp._id || exp.tempId)}
              >
                <X size={20} />
              </button>
            )}
          </div>
        ))
      ) : (
        <p>No experience yet.</p>
      )}

      {isEditing && (
        <div className='mt-4'>
          <input
            type='text'
            placeholder='title'
            value={newExperience.title}
            onChange={(e) =>
              setNewExperience((prev) => ({ ...prev, title: e.target.value }))
            }
            className='w-full p-2 border rounded mb-2'
          />

          <input
            type='text'
            placeholder='company'
            value={newExperience.company}
            onChange={(e) =>
              setNewExperience((prev) => ({ ...prev, company: e.target.value }))
            }
            className='w-full p-2 border rounded mb-2'
          />

          <input
            type='date'
            value={newExperience.startDate}
            onChange={(e) =>
              setNewExperience((prev) => ({ ...prev, startDate: e.target.value }))
            }
            className='w-full p-2 border rounded mb-2'
          />

          <div className='flex items-center mb-2'>
            <input
              type='checkbox'
              id='currentlyWorking'
              checked={newExperience.currentlyWorking}
              onChange={handleCurrentlyWorkingChange}
              className='mr-2'
            />
            <label htmlFor='currentlyWorking'>I currently work here</label>
          </div>

          {!newExperience.currentlyWorking && (
            <input
              type='date'
              value={newExperience.endDate}
              onChange={(e) =>
                setNewExperience((prev) => ({ ...prev, endDate: e.target.value }))
              }
              className='w-full p-2 border rounded mb-2'
            />
          )}

          <textarea
            placeholder='Description'
            value={newExperience.description}
            onChange={(e) =>
              setNewExperience((prev) => ({ ...prev, description: e.target.value }))
            }
            className='w-full p-2 border rounded mb-2'
          />

          <button
            onClick={handleAddExperience}
            className='bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 transition hover:cursor-pointer'
          >
            Add Experience
          </button>
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
            Edit Experiences
          </button>
        )
      )}
    </div>
  );
}
