import React from 'react'
import { Link } from 'react-router-dom';
import useBreadcrumbs from "use-react-router-breadcrumbs";
import {IoIosArrowForward} from 'react-icons/io';


const BreadCrumb = ({pid, title, category}) => {
  const routes = [
    { path: "/:category", breadcrumb: category},
    { path: "/", breadcrumb: "Home" },
    { path: "/:category/:pid/:title", breadcrumb: title},

  ];
  const breadcrumb = useBreadcrumbs(routes)
  return (
    <div className='text-sm flex items-center gap-1'>
      {breadcrumb?.filter(el => !el.match.route === false).map(({ match, breadcrumb }, index, self) => (
        <Link className='flex items-center hover:text-main gap-1' key={match.pathname} to={match.pathname}>
          <span className='capitalize'>{breadcrumb}</span>
          {index !== self.length - 1 && <IoIosArrowForward />}
        </Link>
      ))}
    </div>
  )
}

export default BreadCrumb