import { NowRequest, NowResponse } from '@now/node'

export default (req: NowRequest, res: NowResponse) => {
  console.log(req.body)
  console.log(req.headers)
  res.status(200).json({ a: 1 })
}
