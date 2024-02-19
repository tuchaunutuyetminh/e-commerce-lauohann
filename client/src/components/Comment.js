import React, { memo } from 'react'
import avatar from '../assets/images/avatarDefault.png'
import moment from 'moment'
import { renderStartFromNumber } from '../utils/helper'        
const Comment = ({image = avatar, name = 'Annoymous', updatedAt, comment, star}) => {
  return (
    <div className='flex gap-4'>
        <div className='flex-none'>
            <img src={image} alt='avatar' className='w-[40px] h-[40px] object-cover rounded-full'/>
        </div>
        <div className='flex flex-col flex-auto'>
            <div className='flex justify-between items-center'>
                <h3 className='font-semibold'>{name}</h3>
                <span className='text-xs italic'>{moment(updatedAt).fromNow()}</span>
            </div>
            <div className='flex flex-col gap-2 pl-4 text-sm mt-4 border border-gray-200 py-2 bg-gray-100'>
              <span className='flex items-center gap-1'>
                <span className='font-semibold'>Vote: </span>
                <span className='flex items-center gap-1'>{renderStartFromNumber(star)?.map((el, index) => (
                  <span key={index}>{el}</span>
                ))}</span> 
              </span>

              <span className='flex gap-1'>
                <span className='font-semibold'>Comment: </span>
                <span className='flex items-center gap-1'>{comment}</span> 
              </span>
            </div>
        </div>
    </div>
  )
}

export default memo(Comment)