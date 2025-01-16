import { FormEvent, useState, useEffect } from "react";
import { useAuth } from "../../hooks/authProvider";
import { strings } from "../../constants/strings";
import PreloadedImage from "../../utils/preloadImage";

const Login = () => {
  const [input, setInput] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const auth = useAuth();

  // Check if all fields are filled
  useEffect(() => {
    const { username, password } = input;
    setIsFormValid(username.trim() !== "" && password.trim() !== "");
  }, [input]);

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

  const handleSubmitEvent = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.username || !input.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await auth.loginAction(input);
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (e: FormEvent<HTMLInputElement>): void => {
    const { name, value } = e.currentTarget;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="relative flex min-h-screen bg-bgDark">
      <div className="rounded-md justify-center items-center px-8 py-10 w-3/6 flex flex-col gap-4">
        <h2 className="font-bold text-white my-7 text-4xl">
          Sign <span className="text-primary">i</span>n
        </h2>
        <form className="w-3/6" onSubmit={handleSubmitEvent}>
          {error && (
            <div className="bg-red-500 text-white p-2 rounded mb-4">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-white tracking-wide ">
              Username
            </label>
            <input
              className="py-2 px-1 rounded-md border-gray-700 border-[0.5px]"
              type="text"
              id="username"
              name="username"
              placeholder="user123"
              aria-describedby="username"
              aria-invalid="false"
              onChange={handleInput}
              required
              minLength={6}
            />
            <div id="username" className="sr-only">
              Please enter a valid username. It must contain at least 6
              characters.
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="font-semibold text-white tracking-wide "
            >
              Password
            </label>
            <input
              className="py-2 px-1 rounded-md border-gray-700 border-[0.5px]"
              type="password"
              id="password"
              name="password"
              aria-describedby="user-password"
              aria-invalid="false"
              onChange={handleInput}
              required
              minLength={6}
            />
            <div id="user-password" className="sr-only">
              Your password should be more than 6 characters
            </div>
          </div>
          <div className="flex mt-3 justify-center w-full">
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className={`mt-3 w-full rounded-md py-2 px-1 font-bold ${
                isFormValid && !loading
                  ? "bg-primary hover:bg-primary/90 cursor-pointer"
                  : "bg-gray-400 bg-opacity-20 cursor-not-allowed"
              }`}
            >
              {loading ? "Signing in..." : strings.logandsing.login}
            </button>
          </div>
        </form>
        <button
          onClick={loginAnon}
          className="bg-secondary hover:bg-secondary-dark mx-auto rounded-md w-3/6 justify-center font-bold px-4 py-2"
        >
          {strings.logandsing.guest}
        </button>
        <a
          href="/signup"
          className="justify-center flex underline my-3 text-lg text-primary hover:text-primary/90"
        >
          {strings.logandsing.create}
        </a>
      </div>
      <div className="relative h-screen w-3/6 py-7 px-10">
        <PreloadedImage
          src="/nature.jpeg"
          alt="alt"
          className="relative object-cover h-full rounded-xl w-full"
        />
      </div>
    </div>
  );
};

export default Login;
