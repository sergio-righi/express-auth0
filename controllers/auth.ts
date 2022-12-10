import { Request, Response } from 'express'

import { crypto, env, helper, jwt } from '../utils'
import { UserModel } from '../models'
import { AuthService } from '../services'

class AuthController {
  constructor() {
    AuthService.init()
  }

  async fetch(req: Request, res: Response) {
    try {
      const { authorization } = req.headers;
      const userId = jwt.parseTokenAndGetUserId(helper.fromBearerToken(String(authorization)));
      this.generateTokensAndAuthenticateUser(res, userId);
    } catch (err: any) {
      res.status(500).json(err);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body
      const hashedPassword = crypto.hash(password)
      const response = await UserModel.findOne({
        email,
        password: hashedPassword,
      })

      if (response) {
        this.generateTokensAndAuthenticateUser(res, String(response._id))
      } else {
        res.status(200).json(null)
      }
    } catch (err: any) {
      res.status(500).json(err)
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body
      const response = await UserModel.findOne({
        email,
        password: { $exists: true },
      })
      if (!response) {
        const hashedPassword = crypto.hash(password)
        const user = await UserModel.create({
          ...req.body,
          password: hashedPassword,
        })
        this.generateTokensAndAuthenticateUser(res, String(user._id))
      } else {
        res.status(200).json(null)
      }
    } catch (err: any) {
      res.status(500).json(err)
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (refreshToken) {
        const userId = jwt.parseTokenAndGetUserId(refreshToken)
        this.generateTokensAndAuthenticateUser(res, String(userId))
      } else res.status(200).json(null)
    } catch (err: any) {
      res.status(500).json(err)
    }
  }

  async generateTokensAndAuthenticateUser(res: any, userId: string) {
    const user = await UserModel.findById(userId).select('-password')
    const { token: accessToken, expiration: expirationDate } = jwt.generateAccessToken(userId)
    const { token: refreshToken } = jwt.generateRefreshToken(userId)
    res.status(200).json({ accessToken, expirationDate, refreshToken, user })
  }

  async generateUserTokenAndRedirect(req: any, res: any) {
    const { currentUser } = req;
    const { token: accessToken } = jwt.generateAccessToken(String(currentUser._id));
    const fronendUrl = env.get('url.frontend')
    const successRedirect = `${fronendUrl}authentication`
    res.redirect(`${successRedirect}?accessToken=${accessToken}`)
  }

  async find(req: Request, res: Response) {
    const response = await AuthService.find(req.body)
    res.status(response.status).json(response.data)
  }
}

export default new AuthController()
