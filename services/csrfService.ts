import { GetServerSideProps } from 'next'

export default async function csrfService(context: any) {
  const response = await fetch('http://localhost:8080/csrf')
  const csrfToken = response.headers.get('set-cookie')
  if (!csrfToken) {
    return { props: {} }
  }
  // this is logged in server side
  // console.log(`CSRF TOKEN RECEIVED: ${csrfToken}`)
  context.res.setHeader('set-cookie', csrfToken)
  return { props: {} }
}
