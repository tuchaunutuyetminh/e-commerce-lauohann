import { InputForm, Button } from 'components'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { clsx } from 'clsx'
import moment from 'moment'
import avatar from 'assets/images/avatarDefault.png'
import { apiUpdateCurrent } from 'apis'
import { getCurrent } from 'store/user/asyncActions'
import { toast } from 'react-toastify'
const Personal = () => {
  const { register, formState: { errors, isDirty }, handleSubmit, reset, watch } = useForm()
  const { current } = useSelector(state => state.user)
  const dispatch = useDispatch()
  useEffect(() => {
    reset({
      firstname: current?.firstname,
      lastname: current?.lastname,
      email: current?.email,
      mobile: current?.mobile,
      avatar: current?.avatar
    })
  }, [current])

  const handleUpdateInfor = async(data) => {
    const formData = new FormData()
    if(data.avatar.length > 0) formData.append('avatar', data.avatar[0])
    delete data.avatar
    for(let i of Object.entries(data)) formData.append(i[0], i[1])

    const response = await apiUpdateCurrent(formData)
    if(response.success) {
      dispatch(getCurrent())
      toast.success(response.mes)
    } else toast.error(response.mes)
  }
  return (
    <div className='w-full relative p-4'>
      <header className='text-3xl font-semibold uppercase py-4 border-b border-b-blue-200'>
        Personal
      </header>
      <form onSubmit={handleSubmit(handleUpdateInfor)} className='w-3/5 mx-auto py-8 flex flex-col gap-4'>
        <InputForm
          label='Firstname'
          register={register}
          errors={errors}
          id='firstname'
          validate={{
            required: 'Need fill this field',
          }}
          fullWidth
        />
        <InputForm
          label='Lastname'
          register={register}
          errors={errors}
          id='lastname'
          validate={{
            required: 'Need fill this field',
          }}
          fullWidth
        />
        <InputForm
          label='Email adress'
          register={register}
          errors={errors}
          id='email'
          validate={{
            required: 'Need fill this field',
            pattern: {
              value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
              message: 'Email invalid.'
            }
          }}
          fullWidth
        />

        <InputForm
          label='Phone'
          register={register}
          errors={errors}
          id='mobile'
          validate={{
            required: 'Need fill this field',
            pattern: {
              value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/gm,
              message: 'Phone invalid'
            }
          }}
          fullWidth
        />
        <div className='flex items-center gap-2'>
          <span className='font-medium'>Account status: </span>
          <span className={clsx('font-semibold', current?.isBlocked ? 'text-red-600' : 'text-green-500')}>{current?.isBlocked ? 'Blocked' : 'Actived'}</span>
        </div>

        <div className='flex items-center gap-2'>
          <span className='font-medium'>Role: </span>
          <span >{+current?.role === 1945 ? 'Admin' : 'User'}</span>
        </div>

        <div className='flex items-center gap-2'>
          <span className='font-medium'>Created At: </span>
          <span >{moment(current?.createdAt).fromNow()}</span>
        </div>

        <div className='flex flex-col gap-2'>
          <span className='font-medium'>Profile images: </span>
          <label htmlFor='file'>
            <img src={current?.avatar || avatar} alt='avatar' className='w-20 h-20 ml-8 object-cover rounded-full cursor-pointer'/>
          </label>
          <input 
            type='file' 
            id='file' 
            hidden
            {...register('avatar')}
          />
        </div>

        {isDirty && <div className='w-full flex justify-end'>
          <Button type='submit'>Update information</Button>
        </div>}
      </form>
    </div>
  )
}

export default Personal