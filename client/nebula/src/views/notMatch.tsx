import { strings } from "../constants/strings";
const NotMatch = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h2 className="text-black dark:text-white font-bold text-2xl">
        {strings.notmatch.error}
      </h2>

      <a
        href="/"
        className="font-bold text-black dark:text-white underline mt-10"
      >
        {strings.notmatch.btn}
      </a>
    </div>
  );
};

export default NotMatch;
