import type { NextApiRequest, NextApiResponse } from 'next';

// this file may not be necessary if `public/healthcheck` works better.
export default function Healthcheck(
  req: NextApiRequest,
  res: NextApiResponse<number>
) {
  res.status(200).json(1);
}
