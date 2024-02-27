import React, { useCallback, useEffect, useState } from 'react'
import { Button, InputForm, MarkdownEditor, Select, Loading } from 'components'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { getBase64, validate } from 'utils/helper'
import { toast } from 'react-toastify'
import { apiCreateProduct } from 'apis'
import { showModal } from 'store/app/appSlice'
const CreateProduct = () => {
  const {register, formState: { errors}, reset, handleSubmit, watch} = useForm()
  
  const { categories } = useSelector(state => state.app)
  const dispatch = useDispatch()

  const [payload, setPayload] = useState({
    description: ''
  })

  const [preview, setPreview] = useState({
    thumb: null,
    images: []
  })
  const [invalidFields, setInvalidFields] = useState([])
  const changeValue = useCallback((e) => { 
    setPayload(e)
   },[payload])

   //hover preview img 
   const [hoverElm, setHoverElm] = useState(null)

   //hàm tạo sản phẩm mới
   const handleCreateProduct = async(data) => {
    const invalids = validate(payload, setInvalidFields)
    if(invalids === 0) {
      if(data.category) data.category = categories?.find(el => el._id === data.category)?.title
      const finalPayload = {...data, ...payload}
      const formData = new FormData()
      for(let i of Object.entries(finalPayload)) formData.append(i[0], i[1])
      if(finalPayload.thumb) formData.append('thumb', finalPayload.thumb[0])
      if(finalPayload.images) {
        for(let image of finalPayload.images) formData.append('images', image)
      }
      dispatch(showModal({isShowModal: true, modalChildren: <Loading />}))
      const response = await apiCreateProduct(formData)
      dispatch(showModal({isShowModal: false, modalChildren: null}))
      if(response.success) {
        toast.success(response.mes)
        reset()
        setPayload({
          thumb: '',
          images: []
        })
      } else toast.error(response.mes)
    }
  }

  //handle preview thumb
  const handlePreviewThumb = async(file) => {
    const base64Thumb = await getBase64(file)
    setPreview(prev => ({...prev, thumb: base64Thumb}))
  }

  //handle preview images 
  const handlePreviewImages = async(files) => {
    const imagesPreview = []
    for(let file of files) {
      //check phải file .png hoặc .jpg
      if(file.type !== 'image/png' && file.type !== 'image/jpeg') {
        toast.warning('File not supported!')
        return 
      }
        const base64 = await getBase64(file)
        imagesPreview.push({name: file.name, path: base64})
    }
    setPreview(prev => ({...prev, images: imagesPreview}))

  }
  useEffect(() => { 
    handlePreviewThumb(watch('thumb')[0])
   },[watch('thumb')])

   useEffect(() => { 
    handlePreviewImages(watch('images'))
   },[watch('images')])

  return (
    <div className='w-full'>
      <h1 className='h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b uppercase'>
        <span>Create New Product</span>
      </h1>
      <div className='p-4'>
        <form onSubmit={handleSubmit(handleCreateProduct)}>
          <InputForm
            label='Name product'
            register={register}
            errors={errors}
            id='title'
            validate={{
              required: 'Need fill this field',
            }}
            fullWidth
            placeholder='Name of new product'
          />
          <div className='w-full my-6 flex gap-4'>
          <InputForm
            label='Price'
            register={register}
            errors={errors}
            fullWidth
            id='price'
            validate={{
              required: 'Need fill this field',
            }}
            style='flex-1'
            placeholder='Price of new product'
            type='number'
          /> 
          <InputForm
            label='Quantity'
            register={register}
            errors={errors}
            id='quantity'
            fullWidth
            validate={{
              required: 'Need fill this field',
            }}
            style='flex-1'
            placeholder='Quantity of new product'
            type='number'
          /> 
           <InputForm
            label='Color'
            register={register}
            errors={errors}
            id='color'
            fullWidth
            validate={{
              required: 'Need fill this field',
            }}
            style='flex-1'
            placeholder='Color of new product'
          /> 
          </div>
          <div className='w-full my-6 flex gap-4'>
            <Select 
              label='Category'
              options={categories?.map(el => ({code: el._id, value: el.title}))}
              register={register}
              id='category'
              validate={{required: 'Need fill this field.'}}
              style='flex-auto'
              errors={errors}
              fullWidth
              placeholder='Category of new product'
            />

          {/* option phụ thuộc vào select category  */}
            <Select 
              label='Brand (Optional)'
              options={categories?.find(el => el._id === watch('category'))?.brand.map(el => ({code: el, value: el}))}
              register={register}
              errors={errors}
              id='brand'
              fullWidth
              style='flex-auto'
              placeholder='Brand of new product'
            />
          </div>
          <MarkdownEditor 
            name='description'
            changeValue={changeValue}
            label='Description'
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
          />
          <div className='flex flex-col gap-2 mt-8'>
            <label className='font-semibold' htmlFor='thumb'>Upload thumb</label>
            <input
             type='file' 
             id='thumb' 
             {...register('thumb', {required: 'Need fill this field.'})}
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
              {...register('images', {required: 'Need fill this field.'})}
             />
            {errors["images"] && <small className='text-xs text-red-500'>{errors['images']?.message}</small>}
          </div>
          {preview.images && <div className='my-4 flex w-full gap-3 flex-wrap'>
            {preview.images.map((el, index) => (
              <div
                onMouseEnter={() => setHoverElm(el.name)}
                className='w-fit relative' key={index}
                onMouseLeave={() => setHoverElm(null)}
                >
                <img src={el.path} alt='product' className='w-[200px] object-contain'/>
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
            <Button type='submit'>Create new product</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateProduct