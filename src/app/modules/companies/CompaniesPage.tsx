import { Route, Routes, Outlet, Navigate } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import {Overview} from '../accounts/components/Overview'
import {Settings} from '../accounts/components/settings/Settings'
import { QuotationHeader } from '../accounts/QuotationHeader'
import { QuotationsListWrapper } from '../quotations/quotations-list/QuotationsList'
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
  return (
    <Routes>
      <Route
        path='list'
        element={
          <>
            {/* <PageTitle breadcrumbs={accountBreadCrumbs}>Overview</PageTitle> */}
            <CompaniesListWrapper />
          </>
        }
      />
      <Route
        path='quotationList'
        element={
          <>
            {/* <PageTitle breadcrumbs={accountBreadCrumbs}>Settings</PageTitle> */}
            <QuotationsListWrapper />

            {/* <Settings /> */}
          </>
        }
      />
      <Route
        element={
          <>
            <QuotationHeader />
            <Outlet />
          </>
        }
      >
        <Route
          path='overview'
          element={
            <>
              {/* <PageTitle breadcrumbs={accountBreadCrumbs}>Settings</PageTitle> */}
              <Overview />

              {/* <Settings /> */}
            </>
          }
        />
        <Route
          path='settings'
          element={
            <>
              {/* <PageTitle breadcrumbs={accountBreadCrumbs}>Settings</PageTitle> */}
              {/* <Overview /> */}

              <Settings />
            </>
          }
        />
      </Route>

      <Route index element={<Navigate to='/companies/list' />} />
    </Routes>
    // <Routes>
    //   <Route element={<Outlet />}>
    //     <Route
    //       path='companies'
    //       element={
    //         <>
    //           <PageTitle>Company list</PageTitle>
    //           <CompaniesListWrapper />
    //         </>
    //       }
    //     />
    //   </Route>
    //   <Route index element={<Navigate to='/companies' />} />
    // </Routes>
  )
}

export default CompaniesPage
