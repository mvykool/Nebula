import { useAuth } from "../hooks/authProvider";
import { strings } from "../constants/strings";

const Greetings = () => {
  const { user } = useAuth();

  const getGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      return `🌇 ${strings.homePage.greetings.morning} ${user?.username} `;
    } else if (currentHour < 18) {
      return `🌆 ${strings.homePage.greetings.afternoon} ${user?.username} `;
    } else {
      return `🌃 ${strings.homePage.greetings.evening} ${user?.username} `;
    }
  };
  return (
    <>
      <div className="flex items-center justify-center mt-24 mb-16">
        <h2 className="font-extrabold text-black dark:text-white text-3xl">
          {getGreeting()}
        </h2>
      </div>
    </>
  );
};

export default Greetings;
