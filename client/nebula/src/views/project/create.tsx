/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import { useProject } from "../../hooks/useProject"
import { useNavigate } from "react-router"
import { useAuth } from "../../hooks/authProvider"

const CreateProject = () => {
  const [input, setInput] = useState({
    name: "",
    cover: "",
    description: ""
  })

  const project = useProject();
  const navigate = useNavigate();
  const { defaultPfp } = useAuth();

  const handleSubmit = async (e: any) => {
    e.PreventDefault();

    if (input.name !== "" && input.description !== "") {
      console.log('random', project)
    }
  };

  const handleInput = (e: any) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //temporal goback btn
  const goBack = () => {
    navigate("/")
  }

  return (
    <>
      <div className="w-full h-16 flex justify-center items-center">

        {/*Logo*/}
        <div className="flex gap-2 text-black dark:text-white">
          <i className='bx bxs-analyse text-xl text-primary'></i>
          <p className="font-bold text-lg">Neb<span className="text-primary">u</span>la</p>
        </div>

      </div>

      {/*main section*/}
      <div className='relative w-5/6 mx-auto mt-10'>
        <button onClick={goBack} type="button" className="text-black dark:text-white flex items-center bg-hover dark:bg-opacity-20 px-3 py-1 rounded-md gap-1">
          <i className='bx bx-left-arrow-alt text-xl' ></i>
          back
        </button>
        <div className=' flex border border-hover rounded-md justify-between mt-8 py-20 w-4/6 mx-auto'>

          <div className="w-6/12 flex flex-col justify-center gap-6 mt-10">
            <img
              crossOrigin="anonymous"
              src={defaultPfp}
              alt="profile-picture"
              className="mx-auto rounded-full m-1 h-56 w-56 boder boder-white outline outline-2 outline-offset-2"
            />

            <label
              className="mx-auto bg-primary p-2 text-black dark:text-white font-semibold tracking-wide rounded-md text-sm cursor-pointer"
              htmlFor="file-upload" >Change profile picture</label>

            <input
              type="file"
              id="file-upload"
              accept="image/*"
            />

            <p className="font-extrabold text-black dark:text-white flex justify-center gap-3 items-center mb-8">Active projects:  <span>0</span></p>
          </div>

          <div className="w-6/12 p-4">
            <h3 className="my-5 font-extrabold text-lg text-black dark:text-white">Update Profile</h3>


            <form onSubmit={handleSubmit} className="flex flex-col text-black dark:text-white">
              <label className="font-semibold">Name</label>
              <input
                type="text"
                name="name"
                className="w-5/6 mb-4 mt-1 rounded-md py-1 px-2 text-black"
              />
              <label className="font-semibold">Username</label>
              <input
                type="text"
                name="username"
                className="w-5/6 mb-4 mt-1 rounded-md py-1 px-2 text-black"
              />
              <label className="font-semibold">Email</label>
              <input
                type="text"
                name="email"
                className="w-5/6 mb-4 mt-1 rounded-md py-1 px-2 text-black"
              />
              <button
                type="submit"
              >
                create
              </button>
            </form>
          </div>
        </div>
      </div >
      <h2>New Project</h2>

      <form action="" onSubmit={handleSubmit}>
        <input type="text" onChange={handleInput} />
      </form>
    </>
  )
}

export default CreateProject
