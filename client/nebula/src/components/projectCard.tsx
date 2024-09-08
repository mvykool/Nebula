import { User } from "../types/user.type";

interface IProjectCard {
  name: string;
  cover: string;
  owner: User;
}

const ProjectCard = ({ name, cover, owner }: IProjectCard) => {
  const defPic =
    "https://img.freepik.com/vector-gratis/gradiente-desenfoque-fondo-abstracto-azul-rosa_53876-117324.jpg?w=1380&t=st=1725799161~exp=1725799761~hmac=09c2108daa2ee5633d2cd336c80721b6af51ea968f6716cacedc0d9aab4abd4f";

  return (
    <div className="bg-primary-dark rounded-lg m-2 relative w-[180px] h-[180px] text-black dark:text-white">
      <img
        src={cover || defPic}
        className="h-16 object-cover rounded-t-lg w-full"
        alt=""
      />
      <h4 className="m-2 font-semibold">{name}</h4>

      <div className="flex absolute items-center bottom-0 m-3 gap-2">
        <img src={owner?.picture} className="h-7 w-7 rounded-full" alt="" />
        <span>{owner?.username}</span>
      </div>
    </div>
  );
};

export default ProjectCard;
