import { useGenerateRandomColor } from "../hooks/useGenerateColor";
import { colorArray } from "../utils/colors";
import { User } from "../types/user.type";
import { useNavigate } from "react-router";

interface IProjectCard {
  projectId: number;
  name: string;
  cover: string;
  owner: User | undefined;
}

const ExploreCard = ({ name, cover, owner, projectId }: IProjectCard) => {
  const color = useGenerateRandomColor(colorArray);
  const navigate = useNavigate();

  const goToProject = async (): Promise<void> => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div
      onClick={goToProject}
      className="bg-primary-dark cursor-pointer rounded-lg m-2 relative w-5/6 mx-auto h-60 text-black dark:text-white"
    >
      {cover ? (
        <img
          src={cover}
          className="h-24 object-cover rounded-t-lg w-full"
          alt=""
        />
      ) : (
        <div
          style={{ backgroundColor: color }}
          className="w-full h-28 rounded-t-lg"
        ></div>
      )}
      <div className="p-5">
        <h4 className="font-semibold text-2xl">{name}</h4>

        <div className="flex absolute items-center bottom-4 gap-2">
          <img src={owner?.picture} className="h-10 w-10 rounded-full" alt="" />
          <span>{owner?.username}</span>
        </div>
      </div>
    </div>
  );
};

export default ExploreCard;
