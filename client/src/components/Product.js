import React, { useState } from 'react'
import { formatMoney, renderStartFromNumber } from '../utils/helper'
import label from '../assets/images/new.png'
import trending from '../assets/images/trending.png'
import SelectOption from './SelectOption'
 import icons from '../utils/icons'

 const { AiFillEye, IoMdMenu,BsFillHeartFill } = icons

const Product = ({productData, isNew}) => {
  const [isShowOption, setisShowOption] = useState(false)
  return (
    <div className='w-full text-base px-[10px]'>
      <div 
        className='w-full border p-[15px] flex-col items-center'
        onMouseEnter={(e) => {
          e.stopPropagation()
          setisShowOption(true)}
        }
        onMouseLeave={(e) => {
          e.stopPropagation()
          setisShowOption(false)}
        }
      >
        <div className='w-full relative'>
          {isShowOption &&  <div className='gap-2 absolute bottom-[-10px] flex left-0 right-0 justify-center animate-slide-top'>
            <SelectOption icon={<AiFillEye />}/>
            <SelectOption icon={<IoMdMenu />}/>
            <SelectOption icon={<BsFillHeartFill />}/>
          </div>}
          <img src={productData?.thumb || 'https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png'} 
          alt='product image' 
          className='w-[274px] h-[274px] object-cover'
          />
          <img src={isNew ? label : trending} className='absolute w-[100px] h-[35px] top-[0] right-[0] object-cover'/>
        </div>
        <div className='flex flex-col mt-[15px] items-start w-full'>
          <span className='flex h-4'>{renderStartFromNumber(productData?.totalRatings)?.map((el, index) => (
              <span key={index}>{el}</span>
            ))}</span>
          <span className='line-clamp-1'>{productData?.title}</span>
          <span>{`${formatMoney(productData?.price)} VND`}</span>
        </div>
      </div>
    </div>
  )
}

export default Product