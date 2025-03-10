import { strings } from "../constants/strings";
import CreateButton from "./createButton";

const Welcome = () => {
  return (
    <div className="w-full px-20 md:px-[20%] text-black dark:text-white flex items-center justify-center flex-col">
      <h1 className="font-bold text-5xl text-center md:text-6xl mt-36 md:mt-60 mb-10">
        {strings.homePage.welcome}
        <span className="text-primary">u</span>
        {strings.homePage.nebula}
      </h1>
      <CreateButton />
    </div>
  );
};

export default Welcome;
