import { FormEvent, useState } from "react";
import { useAuth } from "../../hooks/authProvider";

const Login = () => {
  const [input, setInput] = useState({
    username: "",
    password: "",
  });

  //set authProvider
  const auth = useAuth();

  const loginAnon = async (): Promise<void> => {
    const data = {
      username: import.meta.env.VITE_ANON_USER,
      password: import.meta.env.VITE_ANON_PASSWORD,
    };
    try {
      await auth.loginAnonymous(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitEvent = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (input.username !== "" && input.password !== "") {
      try {
        await auth.loginAction(input);
      } catch (error) {
        console.log(error);
      }
      return;
    }
    alert("please provide a valid input");
  };

  const handleInput = (e: FormEvent<HTMLInputElement>): void => {
    const { name, value } = e.currentTarget;

    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div className="flex flex-col justify-center items-center w-full min-h-screen">
      <div className="bg-gray-50 rounded-md px-8 py-10 w-2/6 shadow-md flex flex-col gap-4">
        <h2 className="font-bold my-7 text-4xl">
          Sign <span className="text-primary">i</span>n
        </h2>
        <form onSubmit={handleSubmitEvent}>
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Username</label>
            <input
              className="py-2 px-1 rounded-sm"
              type="text"
              id="username"
              name="username"
              placeholder="user123"
              aria-describedby="username"
              aria-invalid="false"
              onChange={handleInput}
            />
            <div id="username" className="sr-only">
              Please enter a valid username. It must contain at least 6
              characters.
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold" htmlFor="password">
              Password
            </label>
            <input
              className="py-2 px-1 rounded-sm"
              type="password"
              id="password"
              name="password"
              aria-describedby="user-password"
              aria-invalid="false"
              onChange={handleInput}
            />
            <div id="user-password" className="sr-only">
              your password should be more than 6 character
            </div>
          </div>
          <div className="flex mt-3 justify-center w-full">
            <button
              type="submit"
              className="mt-3 bg-purple-300 w-3/6 rounded-md py-2 px-1"
            >
              Login
            </button>
          </div>
        </form>
        <button
          onClick={loginAnon}
          className="bg-green-500 mx-auto rounded-md w-3/6 justify-center px-4 py-2"
        >
          Login as guest
        </button>
        <a
          href="/signup"
          className="justify-center flex underline my-3 text-pink-200"
        >
          Create account
        </a>
      </div>
    </div>
  );
};

export default Login;
