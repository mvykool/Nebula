import { useGenerateGradient } from "../hooks/useGenerateColor";
import { User } from "../types/user.type";
import { useNavigate } from "react-router";

interface IProjectCard {
  projectId: number;
  name: string;
  cover: string;
  owner: User | undefined;
}

const ProjectCard = ({ name, cover, owner, projectId }: IProjectCard) => {
  const gradient = useGenerateGradient();
  const navigate = useNavigate();

  // TAKE TO CLICKED PROJECT

  const goToProject = async (): Promise<void> => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div
      onClick={goToProject}
      className="bg-cardWhite dark:bg-card cursor-pointer rounded-lg m-2 relative size-[150px] md:size-[180px] text-black dark:text-white"
    >
      {cover ? (
        <img
          src={cover}
          className="h-16 object-cover rounded-t-lg w-full"
          alt=""
        />
      ) : (
        <div
          style={{ background: gradient }}
          className="w-full h-16 rounded-t-lg"
        ></div>
      )}

      <h4 className="m-2 font-semibold text-ellipsis overflow-hidden whitespace-nowrap max-w-[200px]">
        {name}
      </h4>

      <div className="flex absolute items-center bottom-0 m-3 gap-2">
        <img
          src={owner?.picture}
          className="size-5 md:size-7 rounded-full"
          alt=""
        />
        <span className="text-sm md:text-base">{owner?.username}</span>
      </div>
    </div>
  );
};

export default ProjectCard;
