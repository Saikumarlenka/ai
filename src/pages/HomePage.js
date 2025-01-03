import { useState } from 'react'
import React from 'react'
import PromptInput from '../components/PromptInput'
import Sidebar from '../components/Sidebar'

const HomePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className='h-screen flex bg-gray-800 w-full'>
          <Sidebar isSidebarOpen={isSidebarOpen}  />
          <PromptInput isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>

    </div>
  )
}

export default HomePage