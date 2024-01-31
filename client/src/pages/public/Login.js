import React, {useCallback, useState} from 'react'
import { InputField, Button } from '../../components'
import { apiRegister, apiLogin, apiForgotPassword } from '../../apis/user'
import Swal from 'sweetalert2'
import { useNavigate, useLocation } from 'react-router-dom'
import path from '../../utils/path'
import {register} from '../../store/user/userSlice'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'


const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [payload, setPayload] = useState({
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    mobile: ''
  })
  const [isRegister, setIsRegister] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const resetPayload = () => {
    setPayload({
      email: '',
      password: '',
      firstname: '',
      lastname: '',
      mobile: ''
    })
  }
  const [email, setEmail] = useState('')
  const handleForgotPassword = async() => {
    const response = await apiForgotPassword({email})
    if(response.success) {
      toast.success(response.mes, {theme: 'colored'})
    }else toast.info(response.mes, {theme: 'colored'})
  }
  const handleSubmit = useCallback(async() => {
    const {firstname, lastname,mobile, ...data} = payload

    if(isRegister) {
      const response = await apiRegister(payload)
      if(response.success) {
        Swal.fire('Congratulation', response.mes, 'success').then(() => {
          setIsRegister(false)
          resetPayload()
        })
      }  else  Swal.fire('Opps', response.mes, 'error')
    } else {
      const rs = await apiLogin(data)
      if(rs.success) {
        dispatch(register({isLoggedIn: true, token: rs.accessToken, userData: rs.userData}))
        navigate(`/${path.HOME}`)
      }  else  Swal.fire('Opps', rs.mes, 'error')
    }
  }, [payload, isRegister])
  return (
    <div className='w-screen h-screen relative'>
      {isForgotPassword && <div className='animate-slide-right absolute top-0 left-0 bottom-0 right-0 bg-white py-8 flex flex-col items-center justify-center z-50'>
        <div className='flex flex-col gap-4'>
          <label htmlFor='email'>Enter your email: </label>
          <input 
            placeholder='Exp: email@gmail.com'
            type='text' 
            id='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className='w-[800px] pb-2 border-b outline-none placeholder:text-sm'
            />
          <div className='flex items-center justify-between w-full'>
            <Button  
              name='Back'
              handleOnclick={() => setIsForgotPassword(false)}
              />
            <Button  
              name='Submit'
              style='px-4 py-2 rounded-md text-white bg-blue-500 text-semibold my-2'
              handleOnclick={handleForgotPassword}
            />
          </div>
        </div>
      </div>}
      <img 
        src='https://img.freepik.com/premium-photo/shopping-cart-blue-background_220873-9999.jpg'
        className='w-full h-full object-cover'
        />
        <div className='absolute top-0 bottom-0 left-0 right-1/2 flex items-center justify-center'>
          <div className='flex flex-col items-center p-8 bg-white rounded-md min-w-[500px]'>
            <h1 className='text-[28px] text-main font-semibold mb-8'>{isRegister ? 'Register' : 'Login'}</h1>
            {isRegister && <div className='flex items-center gap-2'>
              <InputField 
              value={payload.firstname}
              setValue={setPayload}
              nameKey='firstname'
            />
            <InputField 
              value={payload.lastname}
              setValue={setPayload}
              nameKey='lastname'
            />
            </div>}
            <InputField 
              value={payload.email}
              setValue={setPayload}
              nameKey='email'
            />
            {isRegister && <InputField 
              value={payload.mobile}
              setValue={setPayload}
              nameKey='mobile'
            />}
            <InputField 
              value={payload.password}
              setValue={setPayload}
              nameKey='password'
              type='password'
            />
            <Button 
              name={isRegister ? 'Register' : 'Login'}
              handleOnclick={handleSubmit}
              fw
            />
            <div  className='flex items-center justify-between my-2 w-full text-sm'>
              {!isRegister && 
                <span 
                  
                  className='text-blue-500 hover:underline cursor-pointer'
                  onClick={() => setIsForgotPassword(true)}
                >Forgot your account ?</span>}
              {!isRegister && <span 
                className='text-blue-500 hover:underline cursor-pointer'
                onClick={() => setIsRegister(true)}
              >Create account</span>}
              {isRegister && <span 
                className='text-blue-500 hover:underline cursor-pointer w-full text-center'
                onClick={() => setIsRegister(false)}
              >Go Login</span>}
            </div>
          </div>
        </div>
    </div>
  )
}

export default Login