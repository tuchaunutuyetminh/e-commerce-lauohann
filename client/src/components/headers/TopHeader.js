import React, { memo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import path from 'utils/path'
import {useDispatch, useSelector} from 'react-redux'
import { getCurrent } from 'store/user/asyncActions'
import icons from 'utils/icons'
import { logout, clearMessage } from 'store/user/userSlice'
import Swal from 'sweetalert2'
import withBaseComponent from 'components/hocs/withBaseComponent'

const {IoIosLogOut} = icons
const TopHeader = () => {
  const { isLoggedIn, current, mes } = useSelector(state => state.user)
  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    if(isLoggedIn) {
      const setTimeoutId = setTimeout(() => {
        dispatch(getCurrent())
      },300)
      return () => {
        clearTimeout(setTimeoutId)
      }
    }
  },[dispatch, isLoggedIn])

  useEffect(() => { 
    if(mes) Swal.fire('Oops!', mes, 'info').then(() => { 
      dispatch(clearMessage())
      navigate(`/${path.LOGIN}`)
     })
   }, [mes])
  return (
    <div className='h-[38px] w-full bg-main flex items-center justify-center'>
        <div className='text-xs text-white w-main flex items-center justify-between '>
            <span>ORDER ONLINE OR CALL US (+1800) 000 8808</span>
            {isLoggedIn && current
            ? <div className='flex gap-4 text-sm items-center'>
                <span>{`Welcome, ${current?.lastname} ${current?.firstname}`}</span>
                <span
                  onClick={() => dispatch(logout())}
                  className='hover:rounded-full hover:bg-gray-100 hover:text-main p-2 cursor-pointer'
                  ><IoIosLogOut size={18} /></span>
            </div>
            : <Link to={`/${path.LOGIN}`} className='hover:text-gray-800'>Sign In or Create Account</Link>}
        </div>
    </div>
  )
}

export default withBaseComponent(memo(TopHeader))