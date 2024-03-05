import React, { Fragment, useEffect, useState } from 'react'
import logo from '../../assets/images/logo.png'
import icons from '../../utils/icons'
import { Link } from 'react-router-dom'
import path from '../../utils/path'
import { useSelector } from 'react-redux'
import { logout } from 'store/user/userSlice'
import withBaseComponent from 'components/hocs/withBaseComponent'
import { showCart } from 'store/app/appSlice'



const Header = ({ dispatch }) => {
  const { current} = useSelector(state => state.user)
  const [isShowOption, setIsShowOption] = useState(false)
  
  const {RiPhoneFill, MdEmail, FaUserCircle, BsHandbagFill} = icons

  useEffect(() => { 
    const handleClickoutOptions = (e) => { 
      const profile = document.getElementById('profile')
      if(!profile.contains(e.target)) setIsShowOption(false)
    }

    document.addEventListener('click', handleClickoutOptions)
    return () => { 
      document.removeEventListener('click', handleClickoutOptions)
     }
   },[])
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
        {current && <Fragment>
          <div 
              onClick={() => dispatch(showCart())}
              className='cursor-pointer flex px-6 border-r items-center justify-center gap-2'>
            <BsHandbagFill color='red'/>
            <span >{`${current?.cart.length} item(s)` || 0}</span>
          </div>
          <div 
            id='profile'
            onClick={(e) => setIsShowOption(prev => !prev)}
            className='cursor-pointer flex px-6 items-center justify-center gap-2 relative'>
            <FaUserCircle color='bg-main'/>
            <span>Profile</span>
            {/* show option */}
            {isShowOption && <div
                onClick={e => e.preventDefault()}
               className='absolute top-full left-[16px] min-w-[150px] bg-gray-100 border py-2 flex flex-col'>
              <Link className='p-2 hover:bg-sky-100 w-full' to={`/${path.MEMBER}/${path.PERSONAL}`}>
                Personal
              </Link>
              {+current?.role === 1945 && <Link className='p-2 hover:bg-sky-100 w-full' to={`/${path.ADMIN}/${path.DASHBOARD}`}>
                Admin workspace
              </Link>}
              <span 
                onClick={() => dispatch(logout())}
                className='p-2 hover:bg-sky-100 w-full'>Log out</span>
            </div>}
          </div>
        </Fragment>
        }
      </div>
    </div>
  )
}

export default withBaseComponent(Header)