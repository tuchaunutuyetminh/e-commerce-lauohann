import React, { memo } from 'react'
import icons from '../utils/icons'

const {AiOutlineDown} = icons
const SearchItem = ({name, activeClick, changeActiveFilter}) => {
  return (
    <div 
        className='p-3 text-gray-500 relative gap-6 text-xs border border-gray-800 flex items-center'
        onClick={() => changeActiveFilter(name)}    
    >
        <span className='capitalize'>{name}</span>
        <AiOutlineDown />
        {activeClick === name && <div className='absolute top-full left-0 w-fit p-4 bg-red-400'>
            content
        </div>}
    </div>
  )
}

export default memo(SearchItem)