import React from 'react'
import { formatMoney } from '../utils/helper'
import label from '../assets/images/label.webp'
import labelBlue from '../assets/images/label-blue.png'

const Product = ({productData, isNew}) => {
  return (
    <div className='w-full text-base px-[10px]'>
      <div className='w-full border p-[15px] flex-col items-center'>
        <div className='w-full relative'>
          <img src={productData?.thumb || 'https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png'} 
          alt='product image' 
          className='w-[243px] h-[243px] object-cover'
          />
          <img src={isNew ? label : labelBlue} className='absolute w-[120px] top-[-32px] left-[-40px] object-contain'/>
          <span className={`font-bold absolute text-white top-[-10px] left-[-12px] ${isNew ? '' : 'text-sm'}`}>{isNew ? 'New' : 'Trending'}</span>
        </div>
        <div className='flex flex-col mt-[15px] items-start w-full'>
          <span className='line-clamp-1'>{productData?.title}</span>
          <span>{`${formatMoney(productData?.price)} VND`}</span>
        </div>
      </div>
    </div>
  )
}

export default Product