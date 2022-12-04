import { Request, Response } from 'express'
import { MailService } from "../services";
import { BaseController } from './base.controller';

class MailController extends BaseController {
  async verificationCode(req: Request, res: Response) {
    const response = await MailService.verificationCode(req.body)
    res.status(response.status)
  }

  async forgetPassword(req: Request, res: Response) {
    const response = await MailService.forgetPassword(req.body)
    res.status(response.status)
  }
}

export default new MailController()