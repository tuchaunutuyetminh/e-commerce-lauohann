import React, { useState } from 'react'
import { formatMoney, renderStartFromNumber } from '../../utils/helper'
import label from '../../assets/images/new.png'
import trending from '../../assets/images/trending.png'
import SelectOption from '../search/SelectOption'
import icons from '../../utils/icons'
import {Link} from 'react-router-dom'
import path from '../../utils/path'
 const { AiFillEye, IoMdMenu,BsFillHeartFill } = icons

const Product = ({productData, isNew, normal}) => {
  const [isShowOption, setisShowOption] = useState(false)
  return (
    <div className='w-full text-base px-[10px]'>
      <Link 
        className='w-full p-[15px] border flex-col items-center block'
        onMouseEnter={(e) => {
          e.stopPropagation()
          setisShowOption(true)}
        }
        onMouseLeave={(e) => {
          e.stopPropagation()
          setisShowOption(false)}
        }
        to={`/${productData?.category.toLowerCase()}/${productData?._id}/${productData?.title}`}
      >
        <div className='w-full relative flex justify-center'>
          {isShowOption &&  <div className='gap-2 absolute bottom-[-10px] flex left-0 right-0 justify-center animate-slide-top'>
            <SelectOption icon={<AiFillEye />}/>
            <SelectOption icon={<IoMdMenu />}/>
            <SelectOption icon={<BsFillHeartFill />}/>
          </div>}
          <img src={productData?.thumb || 'https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png'} 
          alt='product image' 
          className='w-[274px] h-[274px] object-cover'
          />
          {!normal && <img 
          src={isNew ? label : trending} 
          className='absolute w-[100px] h-[35px] top-[0] right-[0] object-cover'
          />}
        </div>
        <div className='flex flex-col mt-[15px] items-start w-full'>
          <span className='flex h-4'>{renderStartFromNumber(productData?.totalRatings)?.map((el, index) => (
              <span key={index}>{el}</span>
            ))}</span>
          <span className='line-clamp-1'>{productData?.title}</span>
          <span>{`${formatMoney(productData?.price)} VND`}</span>
        </div>
      </Link>
    </div>
  )
}

export default Product