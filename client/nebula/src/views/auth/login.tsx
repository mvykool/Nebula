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
            className="flex items-center justify-center gap-2 bg-white text-gray-800 hover:bg-gray-50 rounded-md w-full py-2 px-4 font-bold"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Demo Login Button */}
          <button
            onClick={handleDemoLogin}
            className="bg-secondary hover:bg-secondary/90 rounded-md w-full justify-center font-bold px-4 py-2"
          >
            Try Demo Version
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
