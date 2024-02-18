import React, { memo, useRef, useEffect } from 'react'
import logo from '../assets/images/logo.png'
import {voteOptions} from '../utils/contants'
import icons from '../utils/icons'
import Button from './Button'

const {AiFillStar} = icons
const VoteOption = ({nameProduct}) => {
  const modalRef = useRef()

  useEffect(() => {
    modalRef.current.scrollIntoView({block: 'center', behavior: 'smooth'})
  },[])
  return (
    <div 
      ref={modalRef}
      onClick={e => e.stopPropagation()}
      className='bg-white w-[700px] p-4 flex flex-col items-center justify-center gap-4'>
        <img src={logo} alt='logo' className='w-[300px] my-8 object-contain'/>
        <h2 className='text-center text-medium text-lg'>{`Voting product ${nameProduct}`}</h2>
        <textarea
          placeholder='Type somethings'
         className='form-textarea w-full placeholder:italic placeholder:text-sm placeholder:text-gray-500'></textarea>
        <div className='w-full flex flex-col gap-4'>
          <p>How do you like this product ?</p>
          <div className='flex items-center justify-center gap-4'>
            {voteOptions.map(el => (
              <div key={el.id} className='w-[80px] bg-gray-200 hover:bg-gray-300 cursor-pointer h-[80px] rounded-md flex items-center justify-center flex-col gap-2'>
                <AiFillStar color='gray'/>
                <span>{el.text}</span>
              </div>
            ))}
          </div>
        </div>
        <Button fw>Sumit</Button>
    </div>
  )
}

export default memo(VoteOption)