import React from 'react'
import { formatMoney, renderStartFromNumber } from '../../utils/helper'
import withBaseComponent from 'components/hocs/withBaseComponent'

const ProductCard = ({price, totalRatings, image, title, pid, navigate, category}) => {
  return (
    <div 
    onClick={() => navigate(`/${category.toLowerCase()}/${pid}/${title}`)}
    className='w-1/3 flex-auto flex px-[10px] mb-[20px] cursor-pointer'>
        <div className='flex w-full border'>
            <img src={image} alt='products' className='w-[120px] object-contain p-4'/>
            <div className='flex flex-col mt-[15px] items-start w-full text-xs'>
            <span className='line-clamp-1 capitalize text-sm'>{title?.toLowerCase()}</span>
            <span className='flex h-4'>{renderStartFromNumber(totalRatings, 14)?.map((el, index) => (
              <span key={index}>{el}</span>
            ))}</span>
            <span>{`${formatMoney(price)} VND`}</span>
            </div>
        </div>
    </div>
  )
}

export default withBaseComponent(ProductCard)