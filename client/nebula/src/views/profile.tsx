import { useAuth } from "../hooks/authProvider"

const Profile = () => {

  const { user } = useAuth();

  return (
    <>
      <div className="w-full h-16 flex justify-around items-center">

        {/*Logo*/}
        <div className="flex gap-2 w-[205px]">
          <i className='bx bxs-analyse text-xl text-purple-700'></i>
          <p className="font-bold text-lg">Neb<span className="text-purple-500">u</span>la</p>
        </div>

      </div>

      {/*main section*/}
      <div className='w-5/6 mx-auto border border-white'>
        <button type="button" className="flex items-center gap-1">
          <i className='bx bx-left-arrow-alt text-xl' ></i>
          back
        </button>
        <div className='flex relative m-20 border border-blue-500 w-3/6 h-full'>
          <img src={user?.picture} alt="profile-picture" className="rounded-full h-2/6 w-2/6 boder boder-white outline outline-2 outline-offset-2" />

          <div>
            <h3>Username</h3>
          </div>
        </div>
      </div >
    </>
  )
}

export default Profile
