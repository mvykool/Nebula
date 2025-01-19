import { useGenerateGradient } from "../hooks/useGenerateColor";
import { User } from "../types/user.type";
import StarButton from "./starButton";
import { Project } from "../types/project.type";
import { useAuth } from "../hooks/authProvider";

interface IProjectCard {
  owner: User | undefined;
  project: Project | undefined;
}

const ExploreCard = ({ project, owner }: IProjectCard) => {
  const gradient = useGenerateGradient();
  const { fetchWithToken } = useAuth();
  const urlBase = import.meta.env.VITE_URL;

  return (
    <a href={`/p/${project?.publishedSlug}`} target="_blank">
      <div className="bg-cardWhite dark:bg-card cursor-pointer rounded-lg m-2 w-full relative mx-auto h-60 text-black dark:text-white">
        {project?.cover ? (
          <img
            src={project?.cover}
            className="h-28 object-cover rounded-t-lg w-full"
            alt=""
          />
        ) : (
          <div
            style={{ background: gradient }}
            className="w-full h-28 rounded-t-lg"
          ></div>
        )}
        <div className="p-5 flex flex-col gap-4 relative">
          <h4 className="font-semibold text-2xl">{project?.name}</h4>
          <div className="flex relative items-center justify-between w-full bottom-0 gap-2">
            <div className="flex items-center gap-2">
              <img
                src={owner?.picture}
                className="h-10 w-10 rounded-full"
                alt=""
              />
              <span>{owner?.username}</span>
            </div>
            <StarButton
              projectId={project?.id}
              initialStarCount={project?.starCount ?? 0}
              urlBase={urlBase}
              fetchWithToken={fetchWithToken}
            />
          </div>
        </div>
      </div>
    </a>
  );
};

export default ExploreCard;
