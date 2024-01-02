import React from 'react'
import logo from '../assets/images/logo.png'
import icons from '../utils/icons'
import { Link } from 'react-router-dom'
import path from '../utils/path'



const Header = () => {

  const {RiPhoneFill, MdEmail, FaUserCircle, BsHandbagFill} = icons
  return (
    <div className='border flex justify-between w-main h-[110px] py-[35px]'>
      <Link to={`/${path.HOME}`}>
        <img src={logo} alt='logo' className='w-[234px] object-contain'/>
      </Link>
      <div className='flex text-[13px] '>
        <div className='flex flex-col px-6 border-r items-center'>
          <span className='flex gap-4 items-center'>
            <RiPhoneFill color='red'/>
            <span className='font-semibold'>(+1800) 000 8808</span>
          </span>
          <span>Mon-Sat 9:00AM - 8:00PM</span>
        </div>
        <div className='flex flex-col px-6 border-r items-center'>
          <span className='flex gap-4 items-center'>
            <MdEmail color='red'/>
            <span className='font-semibold'>SUPPORT@TADATHEMES.COM</span>
          </span>
          <span>Online Support 24/7</span>
        </div>
        <div className='flex px-6 border-r items-center justify-center gap-2'>
          <BsHandbagFill color='red'/>
          <span>0 item(s)</span>
        </div>
        <div className='flex px-6 items-center justify-center'>
          <FaUserCircle size={24}/>
        </div>
      </div>
    </div>
  )
}

export default Header