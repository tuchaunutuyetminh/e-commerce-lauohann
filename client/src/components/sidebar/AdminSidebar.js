import React, { memo, Fragment, useState } from 'react'
import logo from 'assets/images/logo.png'
import { adminSidebar } from 'utils/contants'
import { NavLink } from 'react-router-dom'
import {clsx} from 'clsx'
import { AiOutlineCaretDown, AiOutlineCaretUp } from 'react-icons/ai'

const activedStyle = 'px-4 py-2 flex items-center gap-2  bg-blue-500'
const notActivedStyle = 'px-4 py-2 flex items-center gap-2  hover:bg-blue-100'
const AdminSidebar = () => {
    const [actived, setActived] = useState([])
    const handleShowTabs = (tabID) => {
        if(actived.some(el => el === tabID)) setActived(prev => prev.filter(el => el !== tabID))
        else setActived(prev => [...prev, tabID])
    }
    
  return (
    <div className='bg-white h-full py-4'>
        <div className='flex flex-col items-center justify-center p-4 gap-2'>
            <img src={logo} alt='logo' className='w-[200px] object-contain'/>
            <small>Admin workspace</small>
        </div>
            {adminSidebar.map(el => (
                <Fragment key={el.id}>
                    {el.type === 'SINGLE' && <NavLink 
                        to={el.path}
                        className={({isActive}) => clsx(isActive && activedStyle, !isActive && notActivedStyle)}
                        >
                            <span>{el.icon}</span>
                            <span>{el.text}</span>
                        </NavLink>}
                    {el.type === 'PARENT' && <div 
                        onClick={() => handleShowTabs(+el.id)}
                        className='flex flex-col'
                        >
                            <div className='flex items-center justify-between px-4 py-2 hover:bg-blue-100 cursor-pointer'>
                                <div className='flex gap-2 items-center'>
                                    <span>{el.icon}</span>
                                    <span>{el.text}</span>
                                </div>
                                {actived.some(id => +id === +el.id) ? <AiOutlineCaretUp /> : <AiOutlineCaretDown/>}
                                {/* <AiOutlineCaretDown /> */}
                            </div>
                            {actived.some(id => +id === +el.id) && <div 
                                className='flex flex-col'
                                >
                                {el.submenu.map(item => (
                                    <NavLink 
                                    to={item.path} key={item.text}
                                    onClick={e => e.stopPropagation()}
                                    className={({isActive}) => clsx(isActive && activedStyle, !isActive && notActivedStyle, ' pl-10 text-sm')}
                                    >
                                        {item.text}
                                    </NavLink>
                                ))}
                            </div>}
                        </div>}
                </Fragment>
            ))}
    </div>
  )
}

export default memo(AdminSidebar)