import React from 'react'
import clsx from 'clsx'
import { useParams, useSearchParams, useNavigate, createSearchParams } from 'react-router-dom'

const PagiItem = ({children}) => {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const {category} = useParams()
  const handlePagination = () => { 
    let param = []
    for(let i of params.entries()) param.push(i)
    const queries = {}
    for(let i of param) queries[i[0]] = i[1]
    if(Number(children)) queries.page = children
    console.log(queries)
    navigate({
      pathname: `/${category}`,
      search: createSearchParams(queries).toString()
    })
   }
  return (
    <button 
      onClick={handlePagination}
      className={clsx('w-10 h-10 flex justify-center',
       !Number(children) && 'items-end pb-2', Number(children) && 'items-center hover:rounded-full hover:bg-gray-300', +params.get('page') === +children && 'rounded-full bg-gray-300', !+params.get('page') && children === 1 && 'rounded-full bg-gray-300')}
      type='button'
      disabled={!Number(children)}
    >
        {children}
    </button>
  )
}

export default PagiItem