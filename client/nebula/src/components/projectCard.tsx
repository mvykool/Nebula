import { useEffect, useState } from "react";
import { User } from "../types/user.type";

interface IProjectCard {
  name: string;
  cover: string;
  owner: User;
}

const ProjectCard = ({ name, cover, owner }: IProjectCard) => {
  const [color, setColor] = useState<string>("");

  useEffect(() => {
    setColor(
      "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0"),
    );
  }, []);

  return (
    <div className="bg-primary-dark cursor-pointer rounded-lg m-2 relative w-[180px] h-[180px] text-black dark:text-white">
      {cover ? (
        <img
          src={cover}
          className="h-16 object-cover rounded-t-lg w-full"
          alt=""
        />
      ) : (
        <div
          style={{ backgroundColor: color }}
          className="w-full h-16 rounded-t-lg"
        ></div>
      )}

      <h4 className="m-2 font-semibold">{name}</h4>

      <div className="flex absolute items-center bottom-0 m-3 gap-2">
        <img src={owner?.picture} className="h-7 w-7 rounded-full" alt="" />
        <span>{owner?.username}</span>
      </div>
    </div>
  );
};

export default ProjectCard;
