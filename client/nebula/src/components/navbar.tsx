
const Navbar = () => {
  return (
    <div className="w-full h-16 flex justify-between items-center px-[15%]">

      {/*Logo*/}
      <div className="flex gap-2 w-[205px]">
        <i className='bx bxs-analyse text-xl text-purple-700'></i>
        <p className="font-bold text-lg">Neb<span className="text-purple-500">u</span>la</p>
      </div>

      {/*Main button*/}
      <div className=" flex items-center gap-3">
        <button className="px-2 py-1 bg-purple-200 rounded-md">Projects</button>
      </div>


      {/*user info and logout*/}
      <div className="flex items-center gap-3 w-[205px]">
        <ul className="flex gap-3 mr-4">
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
