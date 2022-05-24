import { Route, Routes, Outlet, Navigate } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { CompaniesListWrapper } from './companies-list/CompaniesList'

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'Companies',
    path: '/companies',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const CompaniesPage = () => {
  return <CompaniesListWrapper />

  // (
  //   <Routes>
  //     <Route element={<Outlet />}>
  //       <Route
  //         path='companies'
  //         element={
  //           <>
  //             <PageTitle>Company list</PageTitle>
  //             <CompaniesListWrapper />
  //           </>
  //         }
  //       />
  //     </Route>
  //     <Route index element={<Navigate to='/companies' />} />
  //   </Routes>
  // )
}

export default CompaniesPage
