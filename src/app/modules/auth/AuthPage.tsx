/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect} from 'react'
import {Outlet, Route, Routes} from 'react-router-dom'
import {Registration} from './components/Registration'
import {ForgotPassword} from './components/ForgotPassword'
import {Login} from './components/Login'
import {toAbsoluteUrl} from '../../../_metronic/helpers'
import {LayoutSplashScreen} from '../../../_metronic/layout/core'

const AuthLayout = () => {
  useEffect(() => {
    document.body.classList.add('bg-white')
    return () => {
      document.body.classList.remove('bg-white')
    }
  }, [])

  // if (localStorage.getItem('isTokenValidated') === 'false')
  //   //state of refreshing access token
  //   return <LayoutSplashScreen /> // or some kind of loading animation

  return (
    <div
      className='d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-cover bgi-attachment-fixed'
      style={{
        backgroundImage: `url(${toAbsoluteUrl('/media/illustrations/sketchy-1/background.jpg')})`,
      }}
    >
      {/* begin::Content */}
      <div className='d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20'>
        {/* begin::Wrapper */}
        <div className='w-lg-500px bg-white rounded shadow-sm p-10 p-lg-15 mx-auto'>
          {/* begin::Logo */}
          <a href='#' className='mb-12'>
            <img
              alt='Logo'
              src={toAbsoluteUrl('/media/logos/TGSB-original.jpg')}
              className='h-200px'
              style={{display: 'block', margin: '0 auto', padding: '20px'}}
            />
          </a>
          {/* end::Logo */}
          <Outlet />
        </div>
        {/* end::Wrapper */}
      </div>
      {/* end::Content */}
    </div>
  )
}

const AuthPage = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path='login' element={<Login />} />
      {/* <Route path='registration' element={<Registration />} /> */}
      <Route path='forgot-password' element={<ForgotPassword />} />
      <Route index element={<Login />} />
    </Route>
  </Routes>
)

export {AuthPage}
