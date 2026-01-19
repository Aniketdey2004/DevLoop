import {Link} from "react-router"
import ProjectEdit from "./ProjectEdit";
import { useState } from "react";

export default function ProjectCard({ project }) {
  const [isEditing,setIsEditing]=useState(false);

  return (
    <div className='card bg-white border shadow-sm'>
      <div className='card-body'>
        <h2 className='card-title'>{project.title}</h2>
        <p className='text-slate-600 line-clamp-2'>{project.description}</p>
        <div className='flex flex-wrap gap-2 mt-2'>
          {project.techStack.map((stack, index) => (
            <span key={index} className='bg-green-500 text-white px-3 py-1 rounded-full text-sm mb-2 flex items-center gap-1'>
              {stack}
            </span>
          ))}
        </div>
        <div className='card-actions justify-between mt-4'>
            <Link to={`/project/${project._id}`} className='btn btn-outline btn-success btn-sm'>
                View
            </Link>
            <button type='button'className='btn btn-ghost btn-sm'onClick={()=>setIsEditing(true)}>
                Edit 
            </button>
        </div>
      </div>
      {isEditing && <ProjectEdit project={project} setIsEditing={setIsEditing}/>}
    </div>
  )
}
