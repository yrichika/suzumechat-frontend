import { csrfTokenSaveKey, getCookie, setCookie } from '@utils/Cookie'
import axios from 'axios'
import { GetServerSideProps } from 'next'

export default function csrfTokenService() {
  if (getCookie(csrfTokenSaveKey)) {
    return
  }
  // FIXME: get `/back` part of the string from .env
  axios
    .get('/back/csrfToken')
    .then(response => {
      const csrfToken = response.data.token
      setCookie(csrfTokenSaveKey, csrfToken)
    })
    .catch(error => console.log(error))
}
