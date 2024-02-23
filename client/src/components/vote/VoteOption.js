import React, { memo, useRef, useEffect, useState } from 'react'
import logo from '../../assets/images/logo.png'
import {voteOptions} from 'utils/contants'
import icons from 'utils/icons'
import {Button} from 'components'

const {AiFillStar} = icons
const VoteOption = ({nameProduct, handleSubmitVoteOption}) => {
  const modalRef = useRef()
  const [chosenScore, setChosenScore] = useState(null)
  const [comment, setcomment] = useState('')
  const [score, setScore] = useState(null)
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
          value={comment}
          onChange={e => setcomment(e.target.value)}
         className='form-textarea w-full placeholder:italic placeholder:text-sm placeholder:text-gray-500'></textarea>
        <div className='w-full flex flex-col gap-4'>
          <p>How do you like this product ?</p>
          <div className='flex items-center justify-center gap-4'>
            {voteOptions.map(el => (
              <div
              key={el.id} 
              onClick={() => {
                setChosenScore(el.id)
                setScore(el.id)
              }}
              className='w-[80px] bg-gray-200 cursor-pointer h-[80px] rounded-md flex items-center justify-center flex-col gap-2'
              >
                {(Number(chosenScore) && chosenScore >= el.id) ? <AiFillStar color='orange'/> : <AiFillStar color='gray'/>}
                <span>{el.text}</span>
              </div>
            ))}
          </div>
        </div>
        <Button fw 
        handleOnclick={() => handleSubmitVoteOption({comment, score})}
        >
          Sumit
        </Button>
    </div>
  )
}

export default memo(VoteOption)