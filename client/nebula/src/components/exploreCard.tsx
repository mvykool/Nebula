import { useGenerateRandomColor } from "../hooks/useGenerateColor";
import { colorArray } from "../utils/colors";
import { User } from "../types/user.type";

interface IProjectCard {
  name: string;
  cover: string;
  owner: User | undefined;
  slug: string | undefined;
}

const ExploreCard = ({ name, slug, cover, owner }: IProjectCard) => {
  const color = useGenerateRandomColor(colorArray);

  return (
    <a href={`/p/${slug}`} target="_blank">
      <div className=" bg-cardWhite dark:bg-card cursor-pointer rounded-lg m-2 relative w-4/6 mx-auto h-60 text-black dark:text-white">
        {cover ? (
          <img
            src={cover}
            className="h-28 object-cover rounded-t-lg w-full"
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
            <img
              src={owner?.picture}
              className="h-10 w-10 rounded-full"
              alt=""
            />
            <span>{owner?.username}</span>
          </div>
        </div>
      </div>
    </a>
  );
};

export default ExploreCard;
