import { lazy, FC, Suspense } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { MasterLayout } from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import { DashboardWrapper } from '../pages/dashboard/DashboardWrapper'
import { MenuTestPage } from '../pages/MenuTestPage'
import { getCSSVariableValue } from '../../_metronic/assets/ts/_utils'
import { shallowEqual, useSelector } from 'react-redux'
import { RootState } from '../../setup'
import { PageTitle } from '../../_metronic/layout/core'


const PrivateRoutes = () => {
  const isAdmin = useSelector<RootState>(({ auth }) => auth.user?.role, shallowEqual)

  const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'))
  const WizardsPage = lazy(() => import('../modules/wizards/WizardsPage'))
  const WidgetsPage = lazy(() => import('../modules/widgets/WidgetsPage'))
  const ChatPage = lazy(() => import('../modules/apps/chat/ChatPage'))
  const UsersPage = lazy(() => import('../modules/apps/user-management/UsersPage'))
  const ExpensesPage = lazy(() => import('../modules/apps/expenses-tracker/ExpensesPage'))
  const CompaniesPage = lazy(() => import('../modules/companies/CompaniesPage'))
  const QuotationsPage = lazy(() => import('../modules/quotations/QuotationsPage'))

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />
        {/* Pages */}
        <Route path='dashboard' element={<DashboardWrapper />} />
        <Route path='menu-test' element={<MenuTestPage />} />
        {/* Lazy Modules */}
        <Route
          path='crafted/pages/profile/*'
          element={
            <SuspensedView>
              <ProfilePage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/pages/wizards/*'
          element={
            <SuspensedView>
              <WizardsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/widgets/*'
          element={
            <SuspensedView>
              <WidgetsPage />
            </SuspensedView>
          }
        />
        {/* <Route
          path='/quotations/*'
          element={
            <SuspensedView>
              <QuotationDetailPage />
            </SuspensedView>
          }
        /> */}
        <Route
          path='apps/chat/*'
          element={
            <SuspensedView>
              <ChatPage />
            </SuspensedView>
          }
        />
        {/* companies */}
        <Route
          path='/companies'
          element={
            <SuspensedView>
              <PageTitle>Company list</PageTitle>
              <CompaniesPage/>
            </SuspensedView>
          }
        />
        {/* Quotations */}
        <Route
          path='/quotations/*'
          element={ 
            <SuspensedView>
              <PageTitle>Quotation lists</PageTitle>
              <QuotationsPage />
            </SuspensedView>
          }
        />
        {isAdmin === 'Administrator' ? (
          <>
            <Route
              path='apps/user-management/*'
              element={
                <SuspensedView>
                  <UsersPage />
                </SuspensedView>
              }
            />
          </>
        ) : (
          <></>
        )}
        {isAdmin === 'Administrator' ? (
          <>
            <Route
              path='apps/expenses-tracker/*'
              element={
                <SuspensedView>
                  <ExpensesPage />
                </SuspensedView>
              }
            />
          </>
        ) : (
          <></>
        )}

        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC = ({ children }) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export { PrivateRoutes }
