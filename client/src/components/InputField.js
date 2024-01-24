import React from 'react'

const InputField = ({value, setValue, nameKey, type, invalidFields, setInvalidFields}) => {

  return (
    <div className='w-full relative'>
        {value.trim() !== '' && <label htmlFor={nameKey} className='animate-slide-top-sm absolute top-0 left-[12px] block bg-white text-[10px] px-1'>{nameKey?.slice(0,1).toUpperCase() + nameKey?.slice(1)}</label>}
        <input 
        type={type || 'text'}
        className='outline-none px-4 py-2 rounded-sm border w-full my-2 placeholder:text-sm'
        placeholder={nameKey?.slice(0,1).toUpperCase() + nameKey?.slice(1)}
        value={value}
        onChange={e => setValue(prev => ({...prev, [nameKey]: e.target.value}))}
        
        />
    </div>
  )
}

export default InputField