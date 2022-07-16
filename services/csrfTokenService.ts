import axios from 'axios'
import { GetServerSideProps } from 'next'

export default async function csrfTokenService() {
  // TODO: necessary?
  axios.get('/api/csrfToken')
}
