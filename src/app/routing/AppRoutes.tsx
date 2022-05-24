/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import React, {FC} from 'react'
import {Routes, Route, BrowserRouter, Navigate} from 'react-router-dom'
import {shallowEqual, useSelector} from 'react-redux'
import {PrivateRoutes} from './PrivateRoutes'
import {ErrorsPage} from '../modules/errors/ErrorsPage'
import {Logout, AuthPage} from '../modules/auth'
import {RootState} from '../../setup'
import {App} from '../App'

/**
 * Base URL of the website.
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */
const {PUBLIC_URL} = process.env

const AppRoutes: FC = () => {
  const isAuthorized = useSelector<RootState>(({auth}) => auth.user, shallowEqual)
  // const inputRef = React.useRef(isAuthorized)
  // const dispatch = useDispatch()

  // if (isAuthorized !== undefined) {
  //   inputRef.current = isAuthorized
  // }

  // if (localStorage.getItem('isTokenValidated') === 'true' && isAuthorized === undefined) {
  //   dispatch(auth.actions.setUser(inputRef.current as UserModel))
  // }

  // need to double check above solution

  // if (localStorage.getItem('isTokenValidated') === 'true' && isAuthorized === undefined)
  //   //state of refreshing access token
  //   return <div /> // or some kind of loading animation

  // triggered 2 kali sebab masa verify token tu ada pegi fetech user pula walaupun masa login dah amik user

  return (
    <BrowserRouter basename={PUBLIC_URL}>
      <Routes>
        <Route element={<App />}>
          <Route path='error/*' element={<ErrorsPage />} />
          <Route path='logout' element={<Logout />} />
          {isAuthorized ? (
            <>
              <Route path='/*' element={<PrivateRoutes />} />
              <Route index element={<Navigate to='/dashboard' />} />
            </>
          ) : (
            <>
              <Route path='auth/*' element={<AuthPage />} />
              <Route path='*' element={<Navigate to='/auth' />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export {AppRoutes}
