/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useAuth } from '../../hooks/authProvider';

const Login = () => {
  const [input, setInput] = useState({
    username: "",
    password: "",
  });

  //set authProvider
  const auth = useAuth();

  const handleSubmitEvent = (e: any) => {
    e.preventDefault();
    console.log(input.username, input.password)
    if (input.username !== "" && input.password !== "") {
      auth.loginAction(input);
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
    <div className='flex justify-center items-center w-full min-h-screen'>
      <form onSubmit={handleSubmitEvent} className='bg-gray-50 rounded-md px-8 py-10 shadow-sm flex flex-col gap-4'>
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
        <button className="mt-3 bg-purple-300 rounded-md py-2 px-1">Submit</button>
      </form>
    </div>
  )
}

export default Login
