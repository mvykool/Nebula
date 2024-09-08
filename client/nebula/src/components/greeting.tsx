import { useAuth } from "../hooks/authProvider";

const Greetings = () => {
  const { user } = useAuth();

  const getGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      return `🌇Good morning, ${user?.username} `;
    } else if (currentHour < 18) {
      return `🌆Good afternoon, ${user?.username} `;
    } else {
      return `🌃Good evening, ${user?.username} `;
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
