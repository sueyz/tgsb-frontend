import {createContext, useContext, useEffect, useMemo, useState} from 'react'
import {Outlet} from 'react-router-dom'
import {AsideDefault} from './components/aside/AsideDefault'
import {Footer} from './components/Footer'
import {HeaderWrapper} from './components/header/HeaderWrapper'
import {Toolbar} from './components/toolbar/Toolbar'
import {RightToolbar} from '../partials/layout/RightToolbar'
import {ScrollTop} from './components/ScrollTop'
import {Content} from './components/Content'
import {PageDataProvider} from './core'
import {useLocation} from 'react-router-dom'
import {DrawerMessenger, ActivityDrawer, Main, InviteUsers, UpgradePlan} from '../partials'
import {MenuComponent} from '../assets/ts/components'
import {QueryResponseProvider} from '../../app/modules/quotations/quotations-list/core/QueryResponseProvider'

const HistoryContext = createContext<HistoryType | undefined>(undefined)

interface HistoryType {
  history?: number
  setHistory: (value: number) => void
}

export const useHistoryState = () => {
  const context = useContext(HistoryContext)
  if (context === undefined) {
    throw new Error('useHistoryState error')
  }
  return context
}

const MasterLayout = () => {
  const location = useLocation()
  useEffect(() => {
    setTimeout(() => {
      MenuComponent.reinitialization()
    }, 500)
  }, [])

  useEffect(() => {
    setTimeout(() => {
      MenuComponent.reinitialization()
    }, 500)
  }, [location.key])

  const [history, setHistory] = useState<number | undefined>()

  const value = useMemo(() => {
    return {history, setHistory}
  }, [history])

  return (
    <PageDataProvider>
      <div className='page d-flex flex-row flex-column-fluid'>
        <AsideDefault />
        <div className='wrapper d-flex flex-column flex-row-fluid' id='kt_wrapper'>
          <HeaderWrapper />

          <div id='kt_content' className='content d-flex flex-column flex-column-fluid'>
            <Toolbar />
            <div className='post d-flex flex-column-fluid' id='kt_post'>
              <Content>
                <HistoryContext.Provider value={value}>
                  <Outlet />
                </HistoryContext.Provider>
              </Content>
            </div>
          </div>
          <Footer />
        </div>
      </div>

      {/* begin:: Drawers */}
      <ActivityDrawer />
      {/* <RightToolbar /> */}
      <DrawerMessenger />
      {/* end:: Drawers */}

      {/* begin:: Modals */}
      {/* for refreshing */}
      <HistoryContext.Provider value={value}>
        <QueryResponseProvider>
          <Main />
        </QueryResponseProvider>
      </HistoryContext.Provider>
      <InviteUsers />
      <UpgradePlan />
      {/* end:: Modals */}
      <ScrollTop />
    </PageDataProvider>
  )
}

export {MasterLayout}
