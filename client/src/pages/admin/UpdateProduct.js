import { InputForm, MarkdownEditor, Select, Button, Loading } from 'components'
import React, { memo, useState, useCallback, useEffect } from 'react'
import { set, useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { getBase64, validate } from 'utils/helper'
import { toast } from 'react-toastify'
import { apiCreateProduct, apiUpdateProduct } from 'apis'
import { showModal } from 'store/app/appSlice'
const UpdateProduct = ({editProduct, render, setEditProduct}) => {
    const {register, handleSubmit, formState: { errors }, reset, watch} = useForm()
    
    //lấy categories từ store cho việc chỉnh sửa brand và category
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

    //preview images
    const [hoverElm, setHoverElm] = useState(null)
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


  //set preview cho cả thumb và images của product, biến isFocusDescription là dependencie để coi có focus vào markdown k, nếu focus vào thì chặn  k cho render lại 
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

    
    //hàm update product 
    const handleUpdateProduct = async(data) => {
        const invalids = validate(payload, setInvalidFields)
        
        if(invalids === 0) {
          if(data.category) data.category = categories?.find(el => el.title === data.category)?.title
          const finalPayload = {...data, ...payload }
          console.log(finalPayload)
          const formData = new FormData()
          for(let i of Object.entries(finalPayload)) formData.append(i[0], i[1])
          
          if(finalPayload.thumb) formData.append('thumb', finalPayload?.thumb?.length === 0 ? preview.thumb : finalPayload.thumb[0])
          if(finalPayload.images) {
            const images = finalPayload?.images?.length === 0  ? preview.images : finalPayload.images
            for(let image of images) formData.append('images', image)
          }
          dispatch(showModal({isShowModal: true, modalChildren: <Loading />}))
          const response = await apiUpdateProduct(formData, editProduct._id)
          dispatch(showModal({isShowModal: false, modalChildren: null}))
          if(response.success) {
            toast.success(response.mes)
            render()
            setEditProduct(null)
          } else toast.error(response.mes)
        }
      }

    
    useEffect(() => { 
        reset({
            title: editProduct.title || '',
            price: editProduct.price || '',
            quantity: editProduct.quantity || '',
            color: editProduct.color || '',
            category: editProduct.category || '',
            brand: editProduct.brand.toLowerCase() || '',
            // thumb: editProduct.thumb || '',
            // images: editProduct.images || []
        })
        setPayload({ description: typeof editProduct?.description === 'object' ? editProduct?.description?.join(', ') : editProduct?.description})
        setPreview({
            thumb: editProduct?.thumb || '',
            images: editProduct?.images || []
        })
    },[editProduct])
    console.log(categories)

  return (
    <div className='w-full flex flex-col gap-4 relative'>
        <div className='h-[69px] w-full'></div>
        <div className='p-4 border-b bg-gray-100 flex justify-between items-center right-0 left-[327px] fixed top-0'>
          <h1 className='text-3xl font-bold tracking-tight'>Update products</h1>
          <span 
            className='text-main hover:underline cursor-pointer'
            onClick={() => setEditProduct(null)}
          >Cancel</span>
        </div>

        <form onSubmit={handleSubmit(handleUpdateProduct)}>
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
              options={categories?.map(el => ({code: el.title, value: el.title}))}
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
              options={categories?.find(el => el.title === watch('category'))?.brand.map(el => ({code: el.toLowerCase(), value: el}))}
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
            value={payload.description}
          />
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
            <Button type='submit'>Update product</Button>
          </div>
        </form>
    </div>
  )
}

export default memo(UpdateProduct)