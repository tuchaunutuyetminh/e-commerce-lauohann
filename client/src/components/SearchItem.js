import React, { memo, useEffect, useState } from 'react'
import icons from '../utils/icons'
import { colors } from '../utils/contants'
import { createSearchParams, useNavigate, useParams } from 'react-router-dom'
import path from '../utils/path'


const {AiOutlineDown} = icons

const SearchItem = ({name, activeClick, changeActiveFilter, type = 'checkbox'}) => {
  const [selected, setSelected] = useState([])
  const navigate = useNavigate()

  const {category} = useParams()
  const handelSelect = (e) => {
    const alreadyEl = selected.find(el => el === e.target.value)
    if(alreadyEl) setSelected(prev => prev.filter(el => el !== e.target.value))
    else setSelected(prev => [...prev, e.target.value])
    changeActiveFilter(null)
  }
  
  useEffect(() => {
    navigate({
      pathname: `/${category}`,
      search: createSearchParams({
        color: selected
      }).toString()
    })
  }, [selected])
  return (
    <div 
        className='p-3 cursor-pointer text-gray-500 relative gap-6 text-xs border border-gray-800 flex items-center'
        onClick={() => changeActiveFilter(name)}    
    >
        <span className='capitalize'>{name}</span>
        <AiOutlineDown />
        {activeClick === name && <div className='absolute z-10 top-[calc(100%+1px)] left-0 w-fit p-4 border bg-white min-w-[150px]'>
            {type === 'checkbox' && <div className=''>
              <div className='p-4 flex items-center justify-between gap-8 border-b'>
                <span className='whitespace-nowrap'>{`${selected.length} selected`}</span>
                <span 
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelected([])
                  }}
                  className='underline hover:text-main cursor-pointer'>Reset</span>
              </div>
              <div 
                onClick={e => e.stopPropagation()}
                className='flex flex-col gap-3 mt-4'>
                {colors.map((el, index) => (
                  <div key={index} className='flex items-center gap-4'>
                    <input 
                      type='checkbox' 
                      value={el}
                      onChange={handelSelect}
                      id={el}
                      className='outline-none'
                      checked={selected.some(selectedItem =>  selectedItem === el)}
                      />
                    <label htmlFor={el} className='capitalize text-gray-700'>{el}</label>
                  </div>
                ))}
              </div>
              </div>}
        </div>}
    </div>
  )
}

export default memo(SearchItem)