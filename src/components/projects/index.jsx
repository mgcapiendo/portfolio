import ProjectLayout from "./ProjectLayout"

const ProjectList = ({projects}) => {
    return (
        <div className="w-full max-w-4xl py-8 space-y-8">
            {projects.map((project, index) => {
                return <ProjectLayout key={index} {...project} />
            })}
        </div>
    )
}

export default ProjectList