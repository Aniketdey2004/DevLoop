import { Link } from "react-router"
import ProjectEdit from "./ProjectEdit";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function ProjectCard({ project }) {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(["authUser"]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:shadow-md transition p-5">
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-slate-800">{project.title}</h2>
        <p className="text-sm text-slate-500 line-clamp-2 mt-1">{project.description}</p>
      </div>
      <div className='flex flex-wrap gap-2 mb-4'>
        {project.techStack.map((stack, index) => (
          <span key={index} className='bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs border border-green-200'>
            {stack}
          </span>
        ))}
      </div>
      <div className="flex justify-between items-center pt-3 border-t">
          <Link to={`/project/${project._id}`} className='text-sm font-medium text-green-600 hover:underline'>
                View
          </Link>
          {project.ownerId===authUser._id && <button type='button'className='text-sm text-slate-500 hover:text-slate-700'onClick={()=>setIsEditing(true)}>
                Edit 
          </button>}
      </div>
      {isEditing && <ProjectEdit project={project} setIsEditing={setIsEditing}/>}
    </div>
  )
}
