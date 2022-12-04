import { Request, Response } from 'express'

import { TokenService } from "../services";
import { BaseController } from './base.controller';

class TokenController extends BaseController {

  async create(req: Request, res: Response) {
    const response = await TokenService.create(req.body)
    res.status(response.status).json(response.data);
  }

  async find(req: Request, res: Response) {
    const response = await TokenService.find(req.params);
    res.status(response.status).json(response.data);
  }

  async grant(req: Request, res: Response) {
    const { code } = req.body;
    const { id: userId } = req.params;
    const response = await TokenService.access(userId, true, code);
    res.status(response.status).json(response.data);
  };

  async revoke(req: Request, res: Response) {
    const { id: userId } = req.params;
    const response = await TokenService.access(userId, false);
    res.status(response.status).json(response.data);
  };

  async reset(req: Request, res: Response) {
    const { id: number } = req.params;
    const response = await TokenService.reset(number, req.body);
    res.status(response.status).json(response.data);
  };
}

export default new TokenController();