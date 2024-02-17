import React, { memo, useEffect, useState } from 'react'
import icons from '../utils/icons'
import { colors } from '../utils/contants'
import { createSearchParams, useNavigate, useParams } from 'react-router-dom'
import path from '../utils/path'
import { apiGetProducts } from '../apis'
import { formatMoney } from '../utils/helper'
import useDebounse from '../hook/useDebounse'

const {AiOutlineDown} = icons

const SearchItem = ({name, activeClick, changeActiveFilter, type = 'checkbox'}) => {
  const [selected, setSelected] = useState([])
  const [bestPrice, setBestPrice] = useState(null)
  const [price, setPrice] = useState({
    from: '',
    to: ''
  })
  const navigate = useNavigate()

  const {category} = useParams()
  const handelSelect = (e) => {
    const alreadyEl = selected.find(el => el === e.target.value)
    if(alreadyEl) setSelected(prev => prev.filter(el => el !== e.target.value))
    else setSelected(prev => [...prev, e.target.value])
    changeActiveFilter(null)
  }
  const fecthBestPriceProduct = async() => {
    const response = await apiGetProducts({sort: '-price', limit: 1})
    if(response.success) setBestPrice(response.products[0].price)
  }


  useEffect(() => {
    if(selected.length > 0) {
      navigate({
        pathname: `/${category}`,
        search: createSearchParams({
          color: selected.join(',')
        }).toString()
      })
    } else {
      navigate(`/${category}`)
    }
  }, [selected])
  useEffect(() => {
    if(type === 'input') fecthBestPriceProduct()
  },[type])

  const debouncePriceFrom = useDebounse(price.from, 500)
  const debouncePriceTo = useDebounse(price.to, 500)
  
  useEffect(() => {

    const data = {} 
    if(Number(price.from) > 0) data.from = price.from
    if(Number(price.to) > 0) data.to = price.to

    navigate({
      pathname: `/${category}`,
      search: createSearchParams(data).toString()
    })
  },[debouncePriceFrom, debouncePriceTo])

  useEffect(() => {
    if(price.from > price.to) alert('From price cannot greater than To price')
  }, [price])
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
            {type === 'input' && <div onClick={e => e.stopPropagation()}>
            <div 
              
              className='p-4 flex items-center justify-between gap-8 border-b'>
                <span className='whitespace-nowrap'>{`The highest price is ${formatMoney(bestPrice)} VND`}</span>
                <span 
                  onClick={(e) => {
                    e.stopPropagation()
                    setPrice({
                      from: '',
                      to: ''
                    })
                    changeActiveFilter(null)
                  }}
                  className='underline hover:text-main cursor-pointer'>Reset</span>
              </div>
              <div className='flex items-center p-2 gap-2'>
                <div className='flex items-center gap-2'>
                  <label className='' htmlFor='from'>From</label>
                  <input type='number' id='from' 
                  value={price.from}
                  onChange={e => setPrice(prev => ({...prev, from: e.target.value}))}
                  className='form-input'/>
                </div>
                <div className='flex items-center gap-2'>
                  <label className='' htmlFor='to'>To</label>
                  <input type='number' id='to' 
                  value={price.to}
                  onChange={e => setPrice(prev => ({...prev, to: e.target.value}))}

                  className='form-input'/>
                </div>
              </div>
              </div>}
        </div>}
    </div>
  )
}

export default memo(SearchItem)