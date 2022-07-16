// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

// TODO: データの内容をちゃんとさせること
type CreatedChannel = {
  hostChannelToken: string
  loginChannelToken: string
  secretKey: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreatedChannel>
) {
  axios.post(`${process.env.BACKEND}/createChannel`, req.body).then(response =>
    res.status(200).json({
      hostChannelToken: 'x', // response.data.hostChannelToken etc...
      loginChannelToken: 'x',
      secretKey: 'x',
    })
  )
}
