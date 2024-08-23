
const Navbar = () => {
  return (
    <div className="w-full h-16 flex justify-between items-center px-[10%]">

      {/*Logo*/}
      <div className="flex">
        <i className='bx bxs-analyse text-xl text-purple-700'></i>
        <p className="font-bold text-lg">Neb<span className="text-purple-500">u</span>la</p>
      </div>

      {/*Main button*/}
      <div className="border-b-4 border-b-purple-500 py-5 px-2">
        <button>Projects</button>
      </div>


      {/*user info and logout*/}
      <div className="flex items-center gap-3">
        <ul className="flex gap-2 mr-4">
          <li><i className='bx bx-moon text-xl'></i></li>
          <li><i className='bx bx-bell text-xl' ></i></li>
        </ul>

        {/*image and name*/}
        <img src="https://avatars.githubusercontent.com/u/87054757?v=4" className="h-10 w-10 rounded-md" alt="user-picture" />
        <p className="font-semibold">username</p>
      </div>
    </div>
  )
}

export default Navbar
