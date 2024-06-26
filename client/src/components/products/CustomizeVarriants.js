import React, { memo, useEffect, useState } from 'react'
import { set, useForm } from 'react-hook-form'
import { InputForm, Button, Loading } from 'components'
import { getBase64 } from 'utils/helper'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { useDispatch } from 'react-redux'
import { showModal } from 'store/app/appSlice'
import { apiAddVarriant } from 'apis'
const CustomizeVarriants = ({customizeVarriants, render, setCustomizeVarriants}) => {
    const {register, handleSubmit, formState: { errors }, reset, watch} = useForm()


    const [preview, setPreview] = useState({
        thumb: null,
        images: []
    })

    const dispatch = useDispatch()
    const handlePreviewThumb = async(file) => {
        const base64Thumb = await getBase64(file)
        setPreview(prev => ({...prev, thumb: base64Thumb}))
      }
  
      const handlePreviewImages = async(files) => {
          const imagesPreview = []
          for(let file of files) {
            // check phải file .png hoặc .jpg
            if(file.type !== 'image/png' && file.type !== 'image/jpeg') {
              toast.warning('File not supported!')
              return 
            }
              const base64 = await getBase64(file)
              imagesPreview.push(base64)
          }
          setPreview(prev => ({...prev, images: imagesPreview}))
      
      }

      useEffect(() => { 
        if(watch('thumb') instanceof FileList && watch('thumb').length > 0){
            handlePreviewThumb(watch('thumb')[0])
        }
      },[watch('thumb')])
    
        useEffect(() => { 
          if (watch('images') instanceof FileList && watch('images').length > 0) {
              handlePreviewImages(watch('images'))
          }
        },[watch('images')])

    useEffect(() => { 
        reset({
            title: customizeVarriants?.title,
            color: customizeVarriants?.color,
            price: customizeVarriants?.price,
        })
        setPreview({
            thumb: customizeVarriants?.thumb,
            images: customizeVarriants?.images
        })
     }, [customizeVarriants])

     const handleAddVarriants = async(data) => {
        if(data.color === customizeVarriants.color) Swal.fire('Oops!', 'Color must change', 'info')
        else {
          const formData = new FormData()
          for(let i of Object.entries(data)) formData.append(i[0], i[1])
          if(data.thumb) formData.append('thumb', data.thumb[0])
          if(data.images) {
            for(let image of data.images) formData.append('images', image)
          }
        dispatch(showModal({isShowModal: true, modalChildren: <Loading />}))
        const response = await apiAddVarriant(formData, customizeVarriants._id)
        dispatch(showModal({isShowModal: false, modalChildren: null}))
        if(response.success) {
          toast.success(response.mes)
          reset()
          setPreview({
            thumb: '',
            images: []
          })
        } else toast.error(response.mes)
      }
     }  
  return (
    <div className='w-full flex flex-col gap-4 relative'>
        <div className='h-[69px] w-full'></div>
        <div className='p-4 border-b bg-gray-100 flex justify-between items-center right-0 left-[327px] fixed top-0 uppercase'>
          <h1 className='text-3xl font-bold tracking-tight'>Customize varriants of product</h1>
          <span 
            className='text-main hover:underline cursor-pointer'
            onClick={() => setCustomizeVarriants(null)}
          >Back</span>
        </div>
        <form onSubmit={handleSubmit(handleAddVarriants)} className='p-4 w-full flex flex-col gap-4'>
            <div className='flex gap-4 items-center w-full'>
                <InputForm
                    label='Original name'
                    register={register}
                    errors={errors}
                    id='title'
                    fullWidth
                    style='flex-auto'
                    validate={{
                      required: 'Need fill this field',
                      }}
                    placeholder='Title of varriant'
                />
            </div>
            <div className='flex gap-4 items-center w-full'>
                <InputForm
                    label='Price product'
                    register={register}
                    errors={errors}
                    id='price'
                    validate={{
                    required: 'Need fill this field',
                    }}
                    fullWidth
                    placeholder='Price of varriant'
                    type='number'
                    style='flex-auto'
                />
                <InputForm
                    label='Color product'
                    register={register}
                    errors={errors}
                    id='color'
                    validate={{
                    required: 'Need fill this field',
                    }}
                    fullWidth
                    placeholder='Color of varriant'
                    style='flex-auto'
                />
            </div>

            <div className='flex flex-col gap-2 mt-8'>
                <label className='font-semibold' htmlFor='thumb'>Upload thumb</label>
                <input
                type='file' 
                id='thumb' 
                {...register('thumb')}
                />
                {errors["thumb"] && <small className='text-xs text-red-500'>{errors['thumb']?.message}</small>}
          </div>
          {preview.thumb && <div className='my-4'>
            <img src={preview.thumb} alt='thumbnail' className='w-[200px] object-contain'/>
          </div>}
          <div className='flex flex-col gap-2 mt-8'>
            <label className='font-semibold' htmlFor='products'>Upload images of product</label>
            <input 
              type='file' 
              id='products'
               multiple
              {...register('images')}
             />
            {errors["images"] && <small className='text-xs text-red-500'>{errors['images']?.message}</small>}
          </div>
          {preview.images && <div className='my-4 flex w-full gap-3 flex-wrap'>
            {preview.images.map((el, index) => (
              <div
                className='w-fit relative' key={index}
                >
                <img src={el} alt='product' className='w-[200px] object-contain'/>
                {/* {hoverElm === el.name && <div 
                  onClick={() => handleRemoveImage(el.name)}
                  className='absolute cursor-pointer inset-0 bg-overlay flex items-center justify-center'
                >
                  <TbTrashXFilled size={24} color='white'/>
                  </div>} */}
              </div>
            ))}
          </div>}
          <div className='my-6'>
            <Button type='submit'>Add varriants</Button>
          </div>
        </form>
    </div>
  )
}

export default memo(CustomizeVarriants)