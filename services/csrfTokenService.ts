import { csrfTokenSaveKey, getCookie, setCookie } from '@utils/Cookie'
import axios from 'axios'
import SpringBootCsrfTokenResponseBody from 'types/SpringBootCsrfTokenResponseBody'

export default function csrfTokenService() {
  if (getCookie(csrfTokenSaveKey)) {
    return
  }
  // FIXME: get `/back` part of the string from .env
  axios
    .get(`${process.env.NEXT_PUBLIC_BACK_PREFIX}/csrfToken`)
    .then(response => {
      const csrfTokenData = response.data as SpringBootCsrfTokenResponseBody
      setCookie(csrfTokenData.headerName, csrfTokenData.token)
    })
    .catch(error => console.warn(error))
}
