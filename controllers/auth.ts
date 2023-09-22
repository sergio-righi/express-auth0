import { Request, Response } from 'express'

import { crypto, helper, jwt } from 'utils'
import { UserModelInstance } from 'models'
import { AuthServiceInstance } from 'services'

export class AuthController {
  constructor() {
    AuthServiceInstance.init()
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
      const response = await UserModelInstance.findOne({
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
      const response = await UserModelInstance.findOne({
        email,
        password: { $exists: true },
      })
      if (!response) {
        const hashedPassword = crypto.hash(password)
        const user = await UserModelInstance.create({
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

  async generateTokensAndAuthenticateUser(res: Response, userId: string) {
    const user = await UserModelInstance.findById(userId).select('-password')
    const { token: accessToken, expiration: expirationDate } = jwt.generateAccessToken(userId)
    const { token: refreshToken } = jwt.generateRefreshToken(userId)
    res.status(200).json({ accessToken, expirationDate, refreshToken, user })
  }

  async generateUserTokenAndRedirect(req: Request, res: Response) {
    const { currentUser } = req as any;
    const { token: accessToken } = jwt.generateAccessToken(String(currentUser._id));
    const fronendUrl = req['callback'];
    const successRedirect = `${fronendUrl}authentication`
    res.redirect(`${successRedirect}?accessToken=${accessToken}`)
  }

  async find(req: Request, res: Response) {
    const response = await AuthServiceInstance.find(req.body)
    res.status(response.status).json(response.data)
  }
}

export const AuthControllerInstance = new AuthController()
