import React, { memo } from 'react'

const SelectQuantity = ({handleChangeQuantity, quantity, handleQuantity}) => {
  console.log(quantity)
  return (
    <div className='flex items-center'>
      <span onClick={() => handleChangeQuantity('minus')} className='cursor-pointer p-2 border-r border-black'>-</span>
      <input 
        type='text' 
        value={quantity}
        onChange={e => handleQuantity(e.target.value)}
        className='py-2 outline-none w-[50px] text-center'/>
      <span onClick={() => handleChangeQuantity('plus')} className='cursor-pointer p-2 border-l border-black'>+</span>
    </div>
  )
}

export default memo(SelectQuantity)