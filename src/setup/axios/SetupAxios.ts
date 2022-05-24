import * as auth from '../../app/modules/auth/redux/AuthRedux'

export default function setupAxios(axios: any, store: any) {
  axios.defaults.headers.Accept = 'application/json'
  axios.interceptors.request.use(
    (config: any) => {
      const {
        auth: {accessToken},
      } = store.getState()

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
      }

      return config
    },
    (err: any) => Promise.reject(err)
  )

  createAxiosResponseInterceptor()

  function createAxiosResponseInterceptor() {
    const interceptor = axios.interceptors.response.use(
      (res: any) => {
        return res
      },
      async (err: any) => {
        const originalConfig = err.config

        if (err.response) {
          // access token expired, will hit error but auto renew token and make user not lose contact with current page

          if (err.response.status === 401 && !originalConfig._retry) {
            // handle infinite loop
            originalConfig._retry = true

            const {
              auth: {refreshToken},
            } = store.getState()

            /*
             * When response code is 401, try to refresh the token.
             * Eject the interceptor so it doesn't loop in case
             * token refresh causes the 401 response
             */
            axios.interceptors.response.eject(interceptor)

            try {
              const rs = await axios.post('http://localhost:5000/api/user/refresh_token', {
                refreshToken: refreshToken,
              })

              const {accessToken, user} = rs.data

              originalConfig.headers.Authorization = `Bearer ${accessToken}`

              // update new access token to persist
              store.dispatch(auth.actions.login(accessToken, refreshToken))
              store.dispatch(auth.actions.setUser(user))

              console.log('updated New AccessToken')

              return axios(originalConfig)
            } catch (_error: any) {
              store.dispatch(auth.actions.logout())

              return Promise.reject(_error)
            } finally {
              createAxiosResponseInterceptor()
            }
          }
          // refresh token expired
        }

        return Promise.reject(err)
      }
    )
  }
}
