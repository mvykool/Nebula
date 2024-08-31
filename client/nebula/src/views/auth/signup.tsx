
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useAuth } from '../../hooks/authProvider';

const SignUp = () => {
  const [input, setInput] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  //set authProvider
  const auth = useAuth();

  const handleSubmitEvent = async (e: any) => {
    e.preventDefault();
    if (input.username !== "" && input.password !== "") {
      try {

        await auth.signupAction(input);

      } catch (error) {
        console.log(error)
      }
      return;
    }
    alert("please provide a valid input");
  };

  const handleInput = (e: any) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className='flex flex-col justify-center items-center w-full min-h-screen'>
      <h2 className="font-bold my-7 text-4xl">Sign <span className="text-purple-400">u</span>p</h2>
      <form onSubmit={handleSubmitEvent} className='bg-gray-50 rounded-md px-8 py-10 w-2/6 shadow-md flex flex-col gap-4'>
        <div className="flex flex-col gap-2">
          <label className='font-semibold'>Name</label>
          <input
            className='py-2 px-1 rounded-sm'
            type="text"
            id="name"
            name="name"
            placeholder="John smith"
            aria-describedby="name"
            aria-invalid="false"
            onChange={handleInput}
          />
          <div id="username" className="sr-only">
            Please enter a valid username. It must contain at least 6 characters.
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className='font-semibold'>Username</label>
          <input
            className='py-2 px-1 rounded-sm'
            type="text"
            id="username"
            name="username"
            placeholder="user123"
            aria-describedby="username"
            aria-invalid="false"
            onChange={handleInput}
          />
          <div id="username" className="sr-only">
            Please enter a valid username. It must contain at least 6 characters.
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className='font-semibold'>Email</label>
          <input
            className='py-2 px-1 rounded-sm'
            type="email"
            id="email"
            name="email"
            placeholder="user@gmail.com"
            aria-describedby="email"
            aria-invalid="false"
            onChange={handleInput}
          />
          <div id="username" className="sr-only">
            Please enter a valid username. It must contain at least 6 characters.
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className='font-semibold' htmlFor="password">Password</label>
          <input
            className='py-2 px-1 rounded-sm'
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
        <button type="submit" className="mt-3 bg-purple-300 rounded-md py-2 px-1">Create Account</button>

        <a href='/login' className='justify-center flex underline my-3 text-pink-200'>Login</a>
      </form>
    </div>
  )
}

export default SignUp
