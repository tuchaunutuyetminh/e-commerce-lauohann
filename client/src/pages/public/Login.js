import React, {useCallback, useEffect, useState} from 'react'
import { InputField, Button, Loading } from 'components'
import { apiRegister, apiLogin, apiForgotPassword, apiFinalRegister } from 'apis/user'
import Swal from 'sweetalert2'
import { useNavigate, Link } from 'react-router-dom'
import path from 'utils/path'
import {login} from 'store/user/userSlice'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import {validate} from 'utils/helper'
import { showModal } from 'store/app/appSlice'
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
  const [isVerifiedEmail, setIsVerifiedEmail] = useState(false)
  const [invalidFields, setInvalidFields] = useState([])
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

  //reset payload 
  useEffect(() => {
    resetPayload()
  }, [isRegister])
  //SUBMI
  const handleSubmit = useCallback(async() => {
    const {firstname, lastname,mobile, ...data} = payload
    const invalids = isRegister ? validate(payload, setInvalidFields) : validate(data, setInvalidFields)

    console.log(invalids)
    if(invalids === 0) {
      if(isRegister) {
        dispatch(showModal({ isShowModal: true, modalChildren: <Loading />}))
        const response = await apiRegister(payload)
        dispatch(showModal({ isShowModal: null, modalChildren: null}))
        if(response.success) {
          setIsVerifiedEmail(true)
        }  else  Swal.fire('Opps', response.mes, 'error')
      } else {
        const rs = await apiLogin(data)
        if(rs.success) {
          dispatch(login({isLoggedIn: true, token: rs.accessToken, userData: rs.userData}))
          navigate(`/${path.HOME}`)
        }  else  Swal.fire('Opps', rs.mes, 'error')
      }
    } 
  }, [payload, isRegister])

  
  const [token, setToken] = useState('')
  const finalRegister = async() => {
    const response = await apiFinalRegister(token)
    if(response.success) {
      Swal.fire('Congratulation', response.response, 'success').then(() => {
        setIsRegister(false)
        resetPayload()
      })
    } else Swal.fire('Opps', response.response, 'error')
    setIsVerifiedEmail(false)
    setToken('')
  }
  return (
    <div className='w-screen h-screen relative'>
      {isVerifiedEmail && <div className='flex justify-center items-center flex-col absolute top-0 left-0 right-0 bottom-0 bg-overlay z-50'>
        <div className='bg-white w-[500px] rounded-md p-8'>
          <h4 className=''>We sent a code to your email. Please check your mail and enter this code here: </h4> 
          <input 
            type='text'
            value={token}
            onChange={e => setToken(e.target.value)}
            className='p-2 border rounded-md outline-none'
          />

          <Button 
            style='px-4 py-2 rounded-md text-white bg-blue-500 text-semibold my-2 ml-5'
            handleOnclick={finalRegister}
          >Submit</Button>
        </div>
      </div>}
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
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
              nameKey='firstname'
            />
            <InputField 
              value={payload.lastname}
              setValue={setPayload}
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
              nameKey='lastname'
            />
            </div>}
            <InputField 
              value={payload.email}
              setValue={setPayload}
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
              nameKey='email'
            />
            {isRegister && <InputField 
              value={payload.mobile}
              setValue={setPayload}
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
              nameKey='mobile'
            />}
            <InputField 
              value={payload.password}
              setValue={setPayload}
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
              nameKey='password'
              type='password'
            />
            <Button 
              handleOnclick={handleSubmit}
              fw
            >{isRegister ? 'Register' : 'Login'}</Button>
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
            <Link to={`/${path.HOME}`} className='text-blue-500 hover:underline cursor-pointer text-sm'>Go home ?</Link>
          </div>
        </div>
    </div>
  )
}

export default Login