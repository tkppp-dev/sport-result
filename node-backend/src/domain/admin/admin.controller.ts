import express from 'express'
import { MessageDto } from '@/utils/default.dto'
import { Admin } from './admin.model'

const router = express.Router()

router.post('/', async (req, res, next) => {
  const id = req.body.id
  const password = req.body.password

  const entity = await Admin.find({
    where: {
      adminId: id,
      password: password
    }
  })

  if (entity.length > 0) {
    res.send(new MessageDto('인증 성공'))
  } else {
    res.status(401).send(new MessageDto('인증 실패'))
  }
})

export default router
