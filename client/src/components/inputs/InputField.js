import React from 'react'
import clsx from 'clsx'
const InputField = ({value, setValue, nameKey, type, invalidFields,fullWidth, setInvalidFields, style, placeholder, isHideLabel}) => {

  return (
    <div className={clsx('flex flex-col relative gap-1', fullWidth && 'w-full')}>
        {!isHideLabel && value?.trim() !== '' && <label htmlFor={nameKey} className='animate-slide-top-sm absolute top-0 left-[12px] block bg-white text-[10px] px-1'>{nameKey?.slice(0,1).toUpperCase() + nameKey?.slice(1)}</label>}
        <input 
        type={type || 'text'}
        className= {clsx('outline-none px-4 py-2 rounded-sm border w-full mt-2 placeholder:text-sm', style)}
        placeholder={placeholder || nameKey?.slice(0,1).toUpperCase() + nameKey?.slice(1)}
        value={value}
        onChange={e => setValue(prev => ({...prev, [nameKey]: e.target.value}))}
        onFocus={() => setInvalidFields && setInvalidFields([])}
        />
        {invalidFields?.some(el => el.name === nameKey) && <small className='text-main text-[10px] italic'>{invalidFields.find(el => el.name === nameKey).mes}</small>}
    </div>
  )
}

export default InputField