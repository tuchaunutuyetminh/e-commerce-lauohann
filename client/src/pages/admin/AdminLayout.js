import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import path from 'utils/path'
import { useSelector } from 'react-redux'
import { AdminSidebar } from 'components'
const AdminLayout = () => {
  const { isLoggedIn, current} = useSelector(state => state.user)
  if(!isLoggedIn || !current || +current.role !== 1945) return <Navigate to={`/${path.LOGIN}`} relative={true}/>
  return (
    <div className='flex w-full bg-gray-100 min-h-screen relative text-gray-900'>
      <div className='w-[320px] flex-none fixed top-0 bottom-0'>
        <AdminSidebar />
      </div>
      <div className='w-[320px]'>

      </div>
      <div className='flex-auto'>
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout