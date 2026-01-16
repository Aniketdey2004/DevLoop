import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { formatDate } from '../utils/dateUtils';
import { v4 as uuidv4 } from 'uuid';
import { X, School } from "lucide-react";

export default function EducationSection({ userData, isOwnProfile, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [educations, setEducations] = useState(userData.education || []);
  const [newEducation, setNewEducation] = useState({
    school: "",
    Degree: "",
    startDate: "",
    endDate: "",
    Grade: ""
  });

  const handleAddEducation = () => {
    if (
      newEducation.school &&
      newEducation.Degree &&
      newEducation.startDate &&
      newEducation.Grade
    ) {
      setEducations((prev) => [
        ...prev,
        { ...newEducation, tempId: uuidv4() }
      ]);

      setNewEducation({
        school: "",
        Degree: "",
        startDate: "",
        endDate: "",
        Grade: ""
      });
    } else {
      toast.error("Provide all fields");
    }
  };

  const handleDeleteEducation = (id) => {
    setEducations((prev) =>
      prev.filter(
        (education) => education._id !== id && education.tempId !== id
      )
    );
  };

  const handleSave = () => {
    const cleanedEducations = educations.map(({ tempId, ...edu }) => ({ ...edu }));
    onSave({ education: cleanedEducations });
    setIsEditing(false);
  };

  return (
    <div className='mb-6 px-4'>
      <h2 className='text-2xl font-semibold mb-4'>Education</h2>

      {educations.length > 0 ? (
        educations.map((edu) => (
          <div key={edu._id || edu.tempId} className='mb-4 flex justify-between'>
            <div className='flex gap-4'>
              <School size={25} />
              <div>
                <h3 className='font-semibold'>{edu.school}</h3>
                <p className='text-gray-600'>{edu.Degree}</p>
                <p className='text-gray-500 text-sm'>
                  {formatDate(edu.startDate)} -{" "}
                  {edu.endDate ? formatDate(edu.endDate) : "Present"}
                </p>
                <p className='text-gray-700'>Grade: {edu.Grade}</p>
              </div>
            </div>

            {isEditing && (
              <button
                className='text-red-500 hover:text-red-700 transition-colors shrink-0'
                onClick={() => handleDeleteEducation(edu._id || edu.tempId)}
              >
                <X size={20} />
              </button>
            )}
          </div>
        ))
      ) : (
        <p>No education added yet.</p>
      )}

      {isEditing && (
        <div className='mt-4'>
          <input
            type='text'
            placeholder='School'
            value={newEducation.school}
            onChange={(e) =>
              setNewEducation((prev) => ({ ...prev, school: e.target.value }))
            }
            className='w-full p-2 border rounded mb-2'
          />

          <input
            type='text'
            placeholder='Degree'
            value={newEducation.degree}
            onChange={(e) =>
              setNewEducation((prev) => ({ ...prev, Degree: e.target.value }))
            }
            className='w-full p-2 border rounded mb-2'
          />

          <input
            type='date'
            value={newEducation.startDate}
            onChange={(e) =>
              setNewEducation((prev) => ({ ...prev, startDate: e.target.value }))
            }
            className='w-full p-2 border rounded mb-2'
          />

          <input
            type='date'
            value={newEducation.endDate}
            onChange={(e) =>
              setNewEducation((prev) => ({ ...prev, endDate: e.target.value }))
            }
            className='w-full p-2 border rounded mb-2'
          />

          <input
            type='text'
            placeholder='Grade'
            value={newEducation.Grade}
            onChange={(e) =>
              setNewEducation((prev) => ({ ...prev, Grade: e.target.value }))
            }
            className='w-full p-2 border rounded mb-2'
          />

          <button
            onClick={handleAddEducation}
            className='bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 transition hover:cursor-pointer'
          >
            Add Education
          </button>
        </div>
      )}

      {isOwnProfile &&
        (isEditing ? (
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
            Edit Education
          </button>
        ))}
    </div>
  );
}
