import { useState, ChangeEvent, FormEvent } from "react";
import { useAuth } from "../hooks/authProvider"
import { useNavigate } from "react-router";

interface FormData {
  [key: string]: string;
}

const Profile = () => {
  const { user } = useAuth();

  //form this.state 
  const [isModified, setIsModified] = useState<boolean>(false);
  const [value, setValue] = useState<FormData>({
    name: user?.name,
    username: user?.username,
    email: user?.email
  });

  const navigate = useNavigate();


  //temporal goback btn
  const goBack = () => {
    navigate("/")
  }

  //detect change
  const formModified = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsModified(true);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isModified) {
      try {
        // Perform your PATCH request here
        const response = await fetch('http://localhost:3000/user/' + user.sub, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(value),
        });
        if (response.ok) {
          console.log('Patch request successful');
          setIsModified(false);
        } else {
          console.error('Patch request failed');
        }
      } catch (error) {
        console.error('Error during patch request:', error);
      }
    }
  };

  console.log("this is: ", user)

  return (
    <>
      <div className="w-full h-16 flex justify-center items-center">

        {/*Logo*/}
        <div className="flex gap-2">
          <i className='bx bxs-analyse text-xl text-purple-700'></i>
          <p className="font-bold text-lg">Neb<span className="text-purple-500">u</span>la</p>
        </div>

      </div>

      {/*main section*/}
      <div className='relative w-5/6 mx-auto mt-10'>
        <button onClick={goBack} type="button" className="flex items-center bg-gray-200 px-3 py-1 rounded-md gap-1">
          <i className='bx bx-left-arrow-alt text-xl' ></i>
          back
        </button>
        <div className=' flex border border-gray-100 rounded-md justify-between mt-8 h-full'>

          <div className="w-6/12 flex flex-col justify-center gap-6">
            <img src={user?.picture} alt="profile-picture" className="mx-auto rounded-full m-1 h-56 w-56 boder boder-white outline outline-2 outline-offset-2" />

            <p className="font-extrabold flex justify-center gap-3 items-center my-4">Active projects:  <span>0</span></p>
          </div>

          <div className="w-7/12 p-5">
            <h3 className="my-5 font-extrabold text-lg">Update Profile</h3>


            <form onSubmit={handleSubmit} className="flex flex-col">
              <label className="font-semibold">Name</label>
              <input
                type="text"
                name="name"
                onChange={formModified}
                value={value.name}
                className="w-5/6 mb-4 mt-1"
              />
              <label className="font-semibold">Username</label>
              <input
                type="text"
                name="username"
                value={value.username}
                className="w-5/6 mb-4 mt-1"
              />
              <label className="font-semibold">Email</label>
              <input
                type="text"
                name="email"
                value={value.email}
                className="w-5/6 mb-4 mt-1"
              />
              <button type="submit" disabled={!isModified} className={!isModified ? 'bg-red-500' : 'bg-blue-500'}>Update</button>
            </form>
          </div>
        </div>
      </div >
    </>
  )
}

export default Profile
