import { FormEvent, useState, useEffect } from "react";
import { useAuth } from "../../hooks/authProvider";
import { strings } from "../../constants/strings";

const SignUp = () => {
  const [input, setInput] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const auth = useAuth();

  // Check if all fields are filled
  useEffect(() => {
    const { name, username, email, password } = input;
    setIsFormValid(
      name.trim() !== "" &&
        username.trim() !== "" &&
        email.trim() !== "" &&
        password.trim() !== "",
    );
  }, [input]);

  const handleSubmitEvent = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (isFormValid) {
      try {
        await auth.signupAction(input);
      } catch (error) {
        console.log(error);
      }
      return;
    }
    alert("Please fill in all fields");
  };

  const handleInput = (e: FormEvent<HTMLInputElement>): void => {
    const { name, value } = e.currentTarget;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col bg-bgDark justify-center items-center w-full min-h-screen">
      <h2 className="font-bold text-white dark:text-white my-7 text-4xl">
        Sign <span className="text-primary">u</span>p
      </h2>
      <form
        onSubmit={handleSubmitEvent}
        className="rounded-md px-8 py-10 w-5/6 md:w-2/6 flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-white  tracking-wide">
            Name
          </label>
          <input
            className="py-2 px-1 rounded-sm"
            type="text"
            id="name"
            name="name"
            placeholder="John smith"
            aria-describedby="name"
            aria-invalid="false"
            onChange={handleInput}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold tracking-wide text-white ">
            Username
          </label>
          <input
            className="py-2 px-1 rounded-sm"
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
          <label className="font-semibold tracking-wide text-white ">
            Email
          </label>
          <input
            className="py-2 px-1 rounded-sm"
            type="email"
            id="email"
            name="email"
            placeholder="user@gmail.com"
            aria-describedby="email"
            aria-invalid="false"
            onChange={handleInput}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold tracking-wide text-white "
            htmlFor="password"
          >
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
            required
            minLength={6}
          />
          <div id="user-password" className="sr-only">
            Your password should be more than 6 characters
          </div>
        </div>
        <button
          type="submit"
          disabled={!isFormValid}
          className={`mt-3 rounded-md font-bold py-2 px-1 ${
            isFormValid
              ? "bg-primary hover:bg-primary/90 cursor-pointer"
              : "bg-gray-400 bg-opacity-20 cursor-not-allowed"
          }`}
        >
          {strings.logandsing.create}
        </button>

        <a
          href="/login"
          className="justify-center flex underline my-3 text-lg text-primary tracking-wider"
        >
          {strings.logandsing.login}
        </a>
      </form>
    </div>
  );
};

export default SignUp;
