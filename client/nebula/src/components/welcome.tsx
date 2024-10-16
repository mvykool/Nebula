import { strings } from "../constants/strings";
import CreateButton from "./createButton";

const Welcome = () => {
  return (
    <div className="w-full px-[20%] text-black dark:text-white flex items-center justify-center flex-col">
      <h1 className="font-bold text-6xl mt-60">
        Welcome to Neb<span className="text-primary">u</span>la
      </h1>
      <p className="mt-14">{strings.homePage.createProject}</p>
      <CreateButton />
    </div>
  );
};

export default Welcome;
