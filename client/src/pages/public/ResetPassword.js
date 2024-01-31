import React, { useState } from 'react'
import { Button } from '../../components'
import { useParams } from 'react-router-dom'
import { apiResetPassword } from '../../apis/user'
import { toast } from 'react-toastify'

const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const { token } = useParams()
  const handleResetPassword = async() => {
    const response = await apiResetPassword({ password, token })
    if(response.success) {
      toast.success(response.mes, {theme: 'colored'})
    }else toast.info(response.mes, {theme: 'colored'})
  }
  return (
    <div className='animate-slide-right absolute top-0 left-0 bottom-0 right-0 bg-white py-8 flex flex-col items-center justify-center z-50'>
        <div className='flex flex-col gap-4'>
          <label htmlFor='password'>Enter your new password: </label>
          <input 
            placeholder='Type here'
            type='text' 
            id='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            className='w-[800px] pb-2 border-b outline-none placeholder:text-sm'
            />
          <div className='flex items-center justify-end w-full'>
            <Button  
              name='Submit'
              style='px-4 py-2 rounded-md text-white bg-blue-500 text-semibold my-2'
              handleOnclick={handleResetPassword}
            />
          </div>
        </div>
      </div>
  )
}

export default ResetPassword