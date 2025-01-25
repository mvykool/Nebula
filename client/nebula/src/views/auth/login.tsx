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

  const handleGoogleLogin = () => {
    auth.loginWithGoogle();
  };

  const handleDemoLogin = async () => {
    try {
      setLoading(true);
      await auth.loginDemo();
    } catch (error) {
      console.error("Demo login error:", error);
      setError("Failed to login with demo account");
    } finally {
      setLoading(false);
    }
  };

  // Check if all fields are filled
  useEffect(() => {
    const { username, password } = input;
    setIsFormValid(username.trim() !== "" && password.trim() !== "");
  }, [input]);

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
      <div className="rounded-md justify-center items-center px-8 py-10 w-full md:w-3/6 flex flex-col gap-4">
        <h2 className="font-bold text-white my-7 text-4xl">
          Sign <span className="text-primary">i</span>n
        </h2>
        <form className="w-5/6 md:w-3/6" onSubmit={handleSubmitEvent}>
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
        <div className="flex flex-col gap-4 w-5/6 md:w-3/6">
          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-1 bg-white text-gray-800 hover:bg-gray-50 rounded-md w-full py-2 px-4 font-bold"
          >
            <i className="bx bxl-google text-2xl"></i>
            Continue with Google
          </button>

          {/* Demo Login Button */}
          <button
            onClick={handleDemoLogin}
            className="bg-secondary hover:bg-secondary/90 rounded-md w-full justify-center font-bold px-4 py-2"
          >
            Log in as Guest
          </button>
        </div>
        <a
          href="/signup"
          className="justify-center flex underline my-3 text-lg text-primary hover:text-primary/90"
        >
          {strings.logandsing.create}
        </a>
      </div>
      <div className="relative hidden md:block h-screen w-3/6 py-7 px-10">
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
