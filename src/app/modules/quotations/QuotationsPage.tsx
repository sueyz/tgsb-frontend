import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {QuotationHeader} from '../accounts/QuotationHeader'
import {Overview} from '../accounts/components/Overview'
import {Settings} from '../accounts/components/settings/Settings'
import {QuotationsListWrapper} from './quotations-list/QuotationsList'

export const quotationsBreadcrumbs: Array<PageLink> = [
  {
    title: 'Quotations',
    path: '/quotations/list',
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

const QuotationsPage = () => {
  return (
    <Routes>
      <Route
        path='list'
        element={
          <>
            {/* <PageTitle breadcrumbs={accountBreadCrumbs}>Overview</PageTitle> */}
            <QuotationsListWrapper />
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
      <Route index element={<Navigate to='/quotations/list' />} />
    </Routes>
  )
}

export default QuotationsPage
