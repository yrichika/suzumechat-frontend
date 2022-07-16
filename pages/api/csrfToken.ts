import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  value: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const response = await fetch(`${process.env.BACKEND}/csrfToken`)
  const csrfToken = response.headers.get('set-cookie')
  if (!csrfToken) {
    return
  }
  // this is logged in server side
  console.log(`CSRF TOKEN RECEIVED: ${csrfToken}`)
  res.setHeader('set-cookie', csrfToken)
  res.status(200).json({ value: 'ok' })
}
