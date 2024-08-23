import React from 'react'
import CreateButton from './createButton'

const Welcome = () => {
  return (
    <div className='w-full px-[20%] flex items-center justify-center flex-col'>
      <h1 className='font-bold text-6xl mt-60'>Welcome to Neb<span className='text-purple-500'>u</span>la</h1>
      <p className='mt-14'>Create your first project</p>
      <CreateButton />
    </div>
  )
}

export default Welcome
