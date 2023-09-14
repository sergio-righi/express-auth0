import { Request, Response } from 'express'

import { TokenServiceInstance } from "services";
import { BaseController } from './base.controller';

export class TokenController extends BaseController {

  async create(req: Request, res: Response) {
    const response = await TokenServiceInstance.create(req.body)
    res.status(response.status).json(response.data);
  }

  async find(req: Request, res: Response) {
    const response = await TokenServiceInstance.find(req.params);
    res.status(response.status).json(response.data);
  }

  async grant(req: Request, res: Response) {
    const { code } = req.body;
    const { id: userId } = req.params;
    const response = await TokenServiceInstance.access(userId, true, code);
    res.status(response.status).json(response.data);
  };

  async revoke(req: Request, res: Response) {
    const { id: userId } = req.params;
    const response = await TokenServiceInstance.access(userId, false);
    res.status(response.status).json(response.data);
  };

  async reset(req: Request, res: Response) {
    const { id: number } = req.params;
    const response = await TokenServiceInstance.reset(number, req.body);
    res.status(response.status).json(response.data);
  };
}

export const TokenControllerInstance = new TokenController();